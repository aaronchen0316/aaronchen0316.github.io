from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import Iterable

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.embeddings import EmbeddingManager
from app.query_intent import QuerySignals, analyze_query
from app.source_metadata import infer_profile_category
from app.vector_store import VectorStore


SYSTEM_PROMPT = """You answer questions about Aaron Chen's research, technical background, projects, experience, hobbies, and public contact details.

Rules:
- Stay grounded in retrieved context only.
- If context is missing or weak, say so clearly.
- Do not invent employers, dates, awards, or personal details not present in context.
- If question is out of scope, redirect toward research, papers, projects, experience, hobbies, or contact.
- Use natural conversational prose, like speaking to a person.
- Keep answer body under 150 words.
- Use short direct sentences.
- Do not use markdown.
- Do not use bullet lists, numbered lists, headings, or bold syntax.
- Minimize use of hyphens. Prefer plain sentence structure unless a hyphen is clearly necessary.
- Do not append citations, source lists, or reading lists.
- Prefer concise answers with concrete details.
"""

WORD_LIMIT = 149


@dataclass(frozen=True)
class RetrievedSource:
    source: str
    page: int | str
    score: float
    source_kind: str


class RAGRetriever:
    def __init__(self, vector_store: VectorStore, embedding_manager: EmbeddingManager):
        self.vector_store = vector_store
        self.embedding_manager = embedding_manager

    def retrieve(self, query: str, top_k: int = 5, score_threshold: float = 0.18) -> list[dict]:
        query_signals = analyze_query(query)
        query_embedding = self.embedding_manager.generate_query_embedding(query_signals.normalized_query)
        results = self.vector_store.query(query_embedding=query_embedding.tolist(), top_k=max(top_k * 5, 24))
        retrieved_docs: list[dict] = []
        candidate_ids: set[str] = set()

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]
        ids = results.get("ids", [[]])[0]

        for doc_id, document, metadata, distance in zip(ids, documents, metadatas, distances):
            similarity_score = 1 - float(distance)
            if similarity_score < min(score_threshold, 0.08):
                continue
            ranking_score = rerank_score(query_signals, document=document, metadata=metadata, similarity_score=similarity_score)
            candidate_ids.add(str(doc_id))
            retrieved_docs.append(
                {
                    "id": doc_id,
                    "content": document,
                    "metadata": metadata,
                    "similarity_score": similarity_score,
                    "ranking_score": ranking_score,
                }
            )

        for candidate in self.vector_store.all_documents():
            candidate_id = str(candidate["id"])
            if candidate_id in candidate_ids:
                continue

            lexical_score = lexical_match_score(
                query_signals,
                document=str(candidate["content"]),
                metadata=dict(candidate["metadata"]),
            )
            if lexical_score <= 0:
                continue

            similarity_score = lexical_score
            ranking_score = rerank_score(
                query_signals,
                document=str(candidate["content"]),
                metadata=dict(candidate["metadata"]),
                similarity_score=similarity_score,
            )
            retrieved_docs.append(
                {
                    "id": candidate_id,
                    "content": candidate["content"],
                    "metadata": candidate["metadata"],
                    "similarity_score": similarity_score,
                    "ranking_score": ranking_score,
                }
            )

        retrieved_docs.sort(
            key=lambda doc: (float(doc["ranking_score"]), float(doc["similarity_score"])),
            reverse=True,
        )
        return retrieved_docs[:top_k]


def build_llm(*, model: str, base_url: str, api_key_env: str) -> ChatOpenAI:
    load_dotenv()
    api_key = os.getenv(api_key_env)
    if not api_key:
        raise RuntimeError(f"Missing required environment variable: {api_key_env}")
    return ChatOpenAI(
        api_key=api_key,
        base_url=base_url,
        model=model,
        temperature=0.2,
        max_tokens=220,
    )


def build_messages(
    query: str,
    context: str,
    history: list[dict] | None = None,
) -> list[SystemMessage | HumanMessage | AIMessage]:
    messages: list[SystemMessage | HumanMessage | AIMessage] = [SystemMessage(content=SYSTEM_PROMPT)]

    if history:
        for turn in history[-8:]:
            role = turn.get("role")
            content = turn.get("content", "").strip()
            if role == "user" and content:
                messages.append(HumanMessage(content=content))
            elif role == "assistant" and content:
                messages.append(AIMessage(content=content))

    messages.append(
        HumanMessage(
            content=f"Context:\n{context}\n\nQuestion:\n{query}\n\nAnswer using only context."
        )
    )
    return messages


def stream_answer(llm: ChatOpenAI, messages: list[SystemMessage | HumanMessage | AIMessage]) -> Iterable[str]:
    emitted_text = ""

    for chunk in llm.stream(messages):
        if not chunk.content:
            continue

        candidate = normalize_answer_text(f"{emitted_text}{chunk.content}")
        limited = limit_words(candidate, WORD_LIMIT)

        if len(limited) <= len(emitted_text):
            if count_words(emitted_text) >= WORD_LIMIT:
                break
            continue

        next_piece = limited[len(emitted_text) :]
        emitted_text = limited
        if next_piece:
            yield next_piece

        if count_words(emitted_text) >= WORD_LIMIT:
            break


def normalize_answer_text(text: str) -> str:
    cleaned = text.replace("**", "")
    cleaned = re.sub(r"(?m)^\s*[-*]\s+", "", cleaned)
    cleaned = re.sub(r"(?m)^\s*\d+\.\s+", "", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def count_words(text: str) -> int:
    return len(re.findall(r"\b\S+\b", text))


def limit_words(text: str, max_words: int) -> str:
    words = list(re.finditer(r"\b\S+\b", text))
    if len(words) <= max_words:
        return text

    cutoff = words[max_words - 1].end()
    return text[:cutoff].rstrip(" ,;:-")


def build_sources(results: list[dict]) -> list[RetrievedSource]:
    return [
        RetrievedSource(
            source=str(doc["metadata"].get("source_file", "unknown")),
            page=doc["metadata"].get("page", 0),
            score=round(float(doc["similarity_score"]), 3),
            source_kind=str(doc["metadata"].get("source_kind", "unknown")),
        )
        for doc in results
    ]


def rerank_score(query_signals: QuerySignals, *, document: str, metadata: dict, similarity_score: float) -> float:
    source_kind = str(metadata.get("source_kind", "unknown")).lower()
    source_file = str(metadata.get("source_file", "unknown")).lower()
    source_title = str(metadata.get("source_title", source_file)).lower()
    section_title = str(metadata.get("section_title", "")).lower()
    section_titles = str(metadata.get("section_titles", "")).lower()
    profile_category = str(metadata.get("profile_category") or infer_profile_category(source_file)).lower()
    haystack = " ".join((source_file, source_title, section_title, section_titles, profile_category, document.lower()))
    score = similarity_score

    if query_signals.is_profile and source_kind == "profile":
        score += 0.04
    if query_signals.is_research and source_kind == "paper":
        score += 0.08
    if query_signals.is_paper_specific and source_kind == "paper":
        score += 0.10
    if query_signals.is_contact or query_signals.is_hobby:
        if profile_category == "hobbies_contact":
            score += 0.18
    elif profile_category == "hobbies_contact":
        score -= 0.22

    if query_signals.is_education:
        if profile_category in {"education_skills", "research_experience"}:
            score += 0.18
        if profile_category in {"projects", "hobbies_contact", "experience_themes"}:
            score -= 0.10
        if "education" in haystack or "degree outcome" in haystack or "advisor" in haystack or "thesis" in haystack:
            score += 0.07

    if query_signals.is_work_history:
        if profile_category in {"industry_experience", "research_experience"}:
            score += 0.16
        if profile_category in {"projects", "overview", "hobbies_contact"}:
            score -= 0.09
        if "period:" in haystack:
            score += 0.05

    if query_signals.is_project:
        if profile_category in {"projects", "resume_projects"}:
            score += 0.15
        if profile_category in {"hobbies_contact"}:
            score -= 0.06

    if query_signals.is_research and source_kind == "profile" and profile_category in {"overview", "experience_themes", "resume_summary", "research_experience"}:
        score += 0.05
    if query_signals.is_research and not (
        query_signals.is_education or query_signals.is_work_history or query_signals.is_project or query_signals.is_paper_specific
    ):
        if profile_category in {"overview", "experience_themes", "resume_summary"}:
            score += 0.10
        if profile_category == "industry_experience":
            score -= 0.06

    phrase_hits = sum(1 for phrase in query_signals.canonical_phrases if phrase.lower() in haystack)
    score += min(0.18, phrase_hits * 0.09)

    term_hits = sum(1 for term in query_signals.terms if term in haystack and len(term) >= 4)
    score += min(0.12, term_hits * 0.015)

    if source_kind == "paper" and query_signals.is_profile:
        score -= 0.06
    if source_kind == "profile" and query_signals.is_paper_specific and profile_category not in {"research_experience"}:
        score -= 0.14
    if "advisor" in query_signals.normalized_query.lower() and "advisor:" in haystack:
        score += 0.08
    if "undergraduate researcher" in query_signals.normalized_query.lower() and "undergraduate researcher" in haystack:
        score += 0.08

    return score


def lexical_match_score(query_signals: QuerySignals, *, document: str, metadata: dict) -> float:
    source_file = str(metadata.get("source_file", "")).lower()
    source_title = str(metadata.get("source_title", source_file)).lower()
    section_title = str(metadata.get("section_title", "")).lower()
    haystack = " ".join((source_file, source_title, section_title, document.lower()))

    phrase_hits = sum(1 for phrase in query_signals.canonical_phrases if phrase.lower() in haystack)
    term_hits = sum(1 for term in query_signals.terms if len(term) >= 4 and term in haystack)
    score = min(0.24, phrase_hits * 0.08 + term_hits * 0.02)

    if query_signals.is_paper_specific and str(metadata.get("source_kind", "")).lower() == "paper" and "paper" in query_signals.normalized_query.lower():
        score += 0.04
    if query_signals.is_education and "education" in haystack:
        score += 0.03
    if query_signals.is_work_history and "period:" in haystack:
        score += 0.03

    if phrase_hits == 0 and term_hits < 3:
        return 0.0

    return min(0.28, score)

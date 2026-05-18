from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import Iterable

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.embeddings import EmbeddingManager
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
        query_embedding = self.embedding_manager.generate_query_embedding(query)
        results = self.vector_store.query(query_embedding=query_embedding.tolist(), top_k=top_k)
        retrieved_docs: list[dict] = []

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]
        ids = results.get("ids", [[]])[0]

        for doc_id, document, metadata, distance in zip(ids, documents, metadatas, distances):
            similarity_score = 1 - float(distance)
            if similarity_score < score_threshold:
                continue
            retrieved_docs.append(
                {
                    "id": doc_id,
                    "content": document,
                    "metadata": metadata,
                    "similarity_score": similarity_score,
                }
            )
        return retrieved_docs


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

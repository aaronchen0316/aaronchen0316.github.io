from __future__ import annotations

import unittest
from pathlib import Path
import sys
from tempfile import TemporaryDirectory

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.corpus import build_corpus
from app.embeddings import EmbeddingManager
from app.guards import detect_blocked_query, evaluate_retrieval_scope
from app.rag import RAGRetriever
from app.settings import get_settings
from app.vector_store import VectorStore
from tests.recruiter_eval_cases import RECRUITER_EVAL_CASES, RecruiterEvalCase


CHAT_API_ROOT = Path(__file__).resolve().parents[1]


class RecruiterEvalTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        settings = get_settings()
        cls.tempdir = TemporaryDirectory()
        cls.embedding_manager = EmbeddingManager()
        cls.vector_store = VectorStore(persist_directory=Path(cls.tempdir.name))
        corpus = build_corpus(settings.profile_dir, settings.pdf_dir)
        embeddings = cls.embedding_manager.generate_embeddings([doc.page_content for doc in corpus], show_progress_bar=False)
        cls.vector_store.upsert_documents(corpus, embeddings)
        cls.retriever = RAGRetriever(vector_store=cls.vector_store, embedding_manager=cls.embedding_manager)

    @classmethod
    def tearDownClass(cls) -> None:
        cls.tempdir.cleanup()

    def test_tracer_bullet_education_queries(self) -> None:
        first = self._run_case(RECRUITER_EVAL_CASES[0])
        second = self._run_case(RECRUITER_EVAL_CASES[5])

        self.assertEqual(first["scope_reason"], "retrieval_evidence", first["report"])
        self.assertIn("resume_education_skills.md", first["source_files"], first["report"])
        self.assertIn("september 2014 to june 2017", first["context"], first["report"])

        self.assertEqual(second["scope_reason"], "retrieval_evidence", second["report"])
        self.assertEqual(second["top_source_file"], "resume_education_skills.md", second["report"])
        self.assertIn("cornell university", second["context"], second["report"])

    def test_recruiter_eval_suite(self) -> None:
        failures: list[str] = []

        for case in RECRUITER_EVAL_CASES:
            outcome = self._run_case(case)
            if outcome["failure"]:
                failures.append(outcome["report"])

        if failures:
            self.fail("\n\n".join(failures))

    def _run_case(self, case: RecruiterEvalCase) -> dict[str, object]:
        blocked = detect_blocked_query(case.question)
        if blocked is not None:
            failure = None
            if case.should_answer:
                failure = f"blocked unexpectedly with reason={blocked.reason}"
            elif case.expected_reason and blocked.reason != case.expected_reason:
                failure = f"expected reason {case.expected_reason}, got {blocked.reason}"
            return {
                "failure": failure,
                "report": self._format_report(
                    case=case,
                    top_sources=[],
                    scope_reason=blocked.reason,
                    scope_supported=False,
                    fallback_triggered=True,
                    failure=failure,
                ),
                "scope_reason": blocked.reason,
                "scope_supported": False,
                "top_source_file": None,
                "source_files": [],
                "context": "",
            }

        results = self.retriever.retrieve(case.question, top_k=5)
        scope = evaluate_retrieval_scope(case.question, results)
        context = "\n\n".join(doc["content"] for doc in results).lower()
        top_sources = [
            (
                str(doc["metadata"].get("source_file", "unknown")),
                str(doc["metadata"].get("source_kind", "unknown")),
                round(float(doc.get("ranking_score", doc["similarity_score"])), 4),
            )
            for doc in results[:5]
        ]
        source_files = [source_file for source_file, _, _ in top_sources]

        failure_parts: list[str] = []
        if case.should_answer:
            if not scope.supported:
                failure_parts.append(f"expected supported but got {scope.reason}")
            if case.expected_source_kind and top_sources:
                if top_sources[0][1] != case.expected_source_kind:
                    failure_parts.append(
                        f"expected top source kind {case.expected_source_kind}, got {top_sources[0][1]}"
                    )
            if case.expected_top_files and top_sources:
                if top_sources[0][0] not in case.expected_top_files:
                    failure_parts.append(
                        f"expected top source in {case.expected_top_files}, got {top_sources[0][0]}"
                    )
            for required_source_file in case.required_source_files:
                if required_source_file not in source_files:
                    failure_parts.append(f"missing source file {required_source_file} in top results")
            for required_text in case.required_context_substrings:
                if required_text not in context:
                    failure_parts.append(f"missing context substring {required_text!r}")
        else:
            if scope.supported:
                failure_parts.append("expected unsupported query but scope was supported")
            if case.expected_reason and scope.reason != case.expected_reason:
                failure_parts.append(f"expected reason {case.expected_reason}, got {scope.reason}")

        failure = "; ".join(failure_parts) if failure_parts else None
        return {
            "failure": failure,
            "report": self._format_report(
                case=case,
                top_sources=top_sources,
                scope_reason=scope.reason,
                scope_supported=scope.supported,
                fallback_triggered=(not scope.supported) or bool(failure_parts),
                failure=failure,
            ),
            "scope_reason": scope.reason,
            "scope_supported": scope.supported,
            "top_source_file": top_sources[0][0] if top_sources else None,
            "source_files": source_files,
            "context": context,
        }

    def _format_report(
        self,
        *,
        case: RecruiterEvalCase,
        top_sources: list[tuple[str, str, float]],
        scope_reason: str,
        scope_supported: bool,
        fallback_triggered: bool,
        failure: str | None,
    ) -> str:
        source_lines = [
            f"- {source_file} [{source_kind}] score={score}"
            for source_file, source_kind, score in top_sources
        ]
        return "\n".join(
            [
                f"Question: {case.question}",
                f"Category: {case.category}",
                f"Expected answerable: {case.should_answer}",
                f"Scope supported: {scope_supported}",
                f"Scope reason: {scope_reason}",
                f"Fallback triggered: {fallback_triggered}",
                f"Failure: {failure or 'none'}",
                "Top sources:",
                *(source_lines or ["- none"]),
            ]
        )


if __name__ == "__main__":
    unittest.main()

from __future__ import annotations

import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.guards import detect_blocked_query, evaluate_retrieval_scope, infer_topic


def make_result(*, score: float, source_kind: str, source_file: str) -> dict:
    return {
        "id": f"{source_file}-{score}",
        "content": "stub",
        "metadata": {
            "source_kind": source_kind,
            "source_file": source_file,
            "page": 0,
        },
        "similarity_score": score,
    }


class GuardTests(unittest.TestCase):
    def test_private_queries_are_blocked(self) -> None:
        decision = detect_blocked_query("What is Aaron's phone number and salary?")

        self.assertIsNotNone(decision)
        self.assertFalse(decision.supported)
        self.assertEqual(decision.topic, "blocked")

    def test_residential_query_is_blocked(self) -> None:
        decision = detect_blocked_query("Where does Aaron live?")

        self.assertIsNotNone(decision)
        self.assertFalse(decision.supported)
        self.assertEqual(decision.topic, "blocked")

    def test_resume_question_is_allowed_by_profile_evidence(self) -> None:
        results = [
            make_result(score=0.53, source_kind="profile", source_file="resume_research_experience.md"),
            make_result(score=0.37, source_kind="profile", source_file="resume_education_skills.md"),
        ]

        decision = evaluate_retrieval_scope("When did Aaron go to UCSD?", results)

        self.assertTrue(decision.supported)
        self.assertEqual(decision.topic, "experience")

    def test_research_question_is_allowed_by_paper_evidence(self) -> None:
        results = [
            make_result(score=0.49, source_kind="paper", source_file="Diffusion-Limited Crystal Growth of Gallium Nitride Using Active Machine Learning.pdf"),
            make_result(score=0.34, source_kind="paper", source_file="Transferable Force Field for Gallium Nitride Crystal Growth from the Melt Using On-The-Fly Active Learning.pdf"),
        ]

        decision = evaluate_retrieval_scope("Tell me about the gallium nitride papers.", results)

        self.assertTrue(decision.supported)
        self.assertEqual(decision.topic, "research")

    def test_weak_evidence_is_rejected(self) -> None:
        results = [
            make_result(score=0.24, source_kind="profile", source_file="overview.md"),
            make_result(score=0.21, source_kind="profile", source_file="projects.md"),
        ]

        decision = evaluate_retrieval_scope("What is Aaron's favorite movie?", results)

        self.assertFalse(decision.supported)
        self.assertEqual(decision.reason, "insufficient_evidence")

    def test_profile_question_requires_profile_evidence(self) -> None:
        results = [
            make_result(score=0.56, source_kind="paper", source_file="Diffusion-Limited Crystal Growth of Gallium Nitride Using Active Machine Learning.pdf"),
            make_result(score=0.41, source_kind="paper", source_file="Transferable Force Field for Gallium Nitride Crystal Growth from the Melt Using On-The-Fly Active Learning.pdf"),
        ]

        decision = evaluate_retrieval_scope("What is Aaron's PhD thesis about?", results)

        self.assertFalse(decision.supported)
        self.assertEqual(decision.reason, "missing_profile_evidence")

    def test_infer_topic_prefers_contact_query(self) -> None:
        topic = infer_topic(
            "How can I contact Aaron?",
            [make_result(score=0.4, source_kind="profile", source_file="overview.md")],
        )

        self.assertEqual(topic, "contact")


if __name__ == "__main__":
    unittest.main()

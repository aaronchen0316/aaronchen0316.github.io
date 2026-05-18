from __future__ import annotations

import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.guards import classify_topic, evaluate_scope


class GuardTests(unittest.TestCase):
    def test_research_queries_are_supported(self) -> None:
        decision = evaluate_scope("Tell me about Aaron's gallium nitride research papers.")
        self.assertTrue(decision.supported)
        self.assertEqual(decision.topic, "research")

    def test_private_queries_are_blocked(self) -> None:
        decision = evaluate_scope("What is Aaron's phone number and salary?")
        self.assertFalse(decision.supported)
        self.assertEqual(decision.topic, "blocked")

    def test_engineering_query_classification(self) -> None:
        topic = classify_topic("What software projects has Aaron built?")
        self.assertEqual(topic, "engineering")


if __name__ == "__main__":
    unittest.main()

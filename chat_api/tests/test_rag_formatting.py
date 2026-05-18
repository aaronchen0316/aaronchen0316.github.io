from __future__ import annotations

import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.rag import WORD_LIMIT, count_words, limit_words, normalize_answer_text


class RagFormattingTests(unittest.TestCase):
    def test_normalize_answer_text_removes_common_markdown_markers(self) -> None:
        text = "3. **Higher predictive accuracy**\n- Better signal"

        self.assertEqual(normalize_answer_text(text), "Higher predictive accuracy\nBetter signal")

    def test_limit_words_caps_text_at_word_limit(self) -> None:
        text = " ".join(f"word{i}" for i in range(WORD_LIMIT + 10))

        limited = limit_words(text, WORD_LIMIT)

        self.assertEqual(count_words(limited), WORD_LIMIT)
        self.assertTrue(limited.endswith(f"word{WORD_LIMIT - 1}"))


if __name__ == "__main__":
    unittest.main()

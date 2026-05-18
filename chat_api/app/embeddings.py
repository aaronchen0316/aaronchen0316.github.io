from __future__ import annotations

import os
from typing import Sequence

import numpy as np
from sentence_transformers import SentenceTransformer


DEFAULT_EMBEDDING_MODEL = "all-MiniLM-L6-v2"
ALLOW_DOWNLOAD_ENV = "CHAT_ALLOW_EMBEDDING_DOWNLOAD"


class EmbeddingManager:
    def __init__(self, model_name: str = DEFAULT_EMBEDDING_MODEL):
        self.model_name = model_name
        self.model = self._load_model()

    def _load_model(self) -> SentenceTransformer:
        try:
            return SentenceTransformer(self.model_name, local_files_only=True)
        except Exception as local_exc:  # pragma: no cover - depends on local model cache/network
            if os.getenv(ALLOW_DOWNLOAD_ENV) == "1":
                try:
                    return SentenceTransformer(self.model_name)
                except Exception as exc:  # pragma: no cover - depends on local model cache/network
                    raise RuntimeError(
                        "Failed to load embedding model. Cache it locally or allow network access for first download."
                    ) from exc

            raise RuntimeError(
                f"Failed to load embedding model from local cache. Set {ALLOW_DOWNLOAD_ENV}=1 to allow "
                "an initial download, or cache the model locally first."
            ) from local_exc

    def generate_embeddings(self, texts: Sequence[str], show_progress_bar: bool = True) -> np.ndarray:
        return self.model.encode(list(texts), show_progress_bar=show_progress_bar)

    def generate_query_embedding(self, query: str) -> np.ndarray:
        return self.generate_embeddings([query], show_progress_bar=False)[0]

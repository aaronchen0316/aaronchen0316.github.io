from __future__ import annotations

from app.embeddings import EmbeddingManager


def main() -> int:
    manager = EmbeddingManager()
    print(f"Embedding model cached at {manager.cache_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

from app.corpus import build_corpus
from app.embeddings import EmbeddingManager
from app.settings import get_settings
from app.vector_store import VectorStore


def main() -> int:
    settings = get_settings()
    corpus = build_corpus(settings.profile_dir, settings.pdf_dir)
    embedding_manager = EmbeddingManager()
    embeddings = embedding_manager.generate_embeddings([doc.page_content for doc in corpus])
    vector_store = VectorStore(persist_directory=settings.vector_store_dir)
    count = vector_store.upsert_documents(corpus, embeddings)
    print(f"Ingested {count} chunks into {settings.vector_store_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

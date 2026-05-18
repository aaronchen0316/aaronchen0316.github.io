from __future__ import annotations

import json
import time
from dataclasses import asdict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.analytics import log_metric
from app.embeddings import EmbeddingManager
from app.guards import evaluate_scope
from app.rag import RAGRetriever, build_llm, build_messages, build_sources, stream_answer
from app.settings import get_settings
from app.vector_store import VectorStore


settings = get_settings()
app = FastAPI(title="Aaron Portfolio Chat API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedding_manager = EmbeddingManager()
vector_store = VectorStore(persist_directory=settings.vector_store_dir)
retriever = RAGRetriever(vector_store=vector_store, embedding_manager=embedding_manager)


class ChatRequest(BaseModel):
    query: str = Field(min_length=1)
    history: list[dict] = Field(default_factory=list)


def sse_payload(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "index_ready": vector_store.count() > 0,
        "document_count": vector_store.count(),
        "profile_dir": str(settings.profile_dir),
        "pdf_dir": str(settings.pdf_dir),
    }


@app.post("/chat")
async def chat(request: ChatRequest) -> StreamingResponse:
    scope = evaluate_scope(request.query)

    async def event_stream():
        start = time.perf_counter()
        success = False
        source_count = 0

        try:
            if not scope.supported:
                message = scope.reply_hint
                yield sse_payload({"type": "token", "content": message})
                yield sse_payload({"type": "done", "sources": [], "topic": scope.topic})
                success = True
                return

            if vector_store.count() == 0:
                yield sse_payload(
                    {
                        "type": "error",
                        "message": "Vector store empty. Run `python3 -m app.ingest` before serving chat.",
                    }
                )
                return

            llm = build_llm(
                model=settings.llm_model,
                base_url=settings.llm_base_url,
                api_key_env=settings.api_key_env,
            )
            results = retriever.retrieve(request.query, top_k=5)
            sources = [asdict(source) for source in build_sources(results)]
            source_count = len(sources)

            if not results:
                message = "I do not have enough grounded context for that yet. Ask about Aaron's papers, projects, experience, hobbies, or contact details."
                yield sse_payload({"type": "token", "content": message})
                yield sse_payload({"type": "done", "sources": [], "topic": scope.topic})
                success = True
                return

            context = "\n\n".join(doc["content"] for doc in results)
            messages = build_messages(request.query, context, request.history)
            for chunk in stream_answer(llm, messages):
                yield sse_payload({"type": "token", "content": chunk})

            yield sse_payload({"type": "done", "sources": sources, "topic": scope.topic})
            success = True
        except Exception as exc:  # pragma: no cover - runtime integration
            yield sse_payload({"type": "error", "message": str(exc)})
        finally:
            elapsed_ms = int((time.perf_counter() - start) * 1000)
            log_metric(
                settings.analytics_path,
                topic=scope.topic,
                latency_ms=elapsed_ms,
                success=success,
                source_count=source_count,
            )

    return StreamingResponse(event_stream(), media_type="text/event-stream")

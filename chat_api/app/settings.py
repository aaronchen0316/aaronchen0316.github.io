from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_PROFILE_DIR = REPO_ROOT / "chat_api" / "content" / "profile"
DEFAULT_VECTOR_STORE_DIR = REPO_ROOT / "chat_api" / "data" / "vector_store"
DEFAULT_ANALYTICS_PATH = REPO_ROOT / "chat_api" / "data" / "analytics" / "chat_metrics.jsonl"
DEFAULT_EXTERNAL_PDF_DIR = Path("/Users/aaronchen/Documents/Code/learning/RAG_paper/data/pdf")
DEFAULT_LOCAL_PDF_DIR = REPO_ROOT / "chat_api" / "data" / "pdf"


@dataclass(frozen=True)
class Settings:
    profile_dir: Path
    pdf_dir: Path
    vector_store_dir: Path
    analytics_path: Path
    allowed_origins: list[str]
    llm_model: str
    llm_base_url: str
    api_key_env: str


def _resolve_pdf_dir() -> Path:
    configured = os.getenv("CHAT_PDF_DIR")
    if configured:
        return Path(configured).expanduser().resolve()
    if DEFAULT_LOCAL_PDF_DIR.exists():
        return DEFAULT_LOCAL_PDF_DIR
    return DEFAULT_EXTERNAL_PDF_DIR


def get_settings() -> Settings:
    load_dotenv()
    allowed_origins_raw = os.getenv(
        "CHAT_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,https://aaronchen0316.github.io",
    )

    return Settings(
        profile_dir=Path(os.getenv("CHAT_PROFILE_DIR", str(DEFAULT_PROFILE_DIR))).expanduser().resolve(),
        pdf_dir=_resolve_pdf_dir(),
        vector_store_dir=Path(
            os.getenv("CHAT_VECTOR_STORE_DIR", str(DEFAULT_VECTOR_STORE_DIR))
        ).expanduser().resolve(),
        analytics_path=Path(
            os.getenv("CHAT_ANALYTICS_PATH", str(DEFAULT_ANALYTICS_PATH))
        ).expanduser().resolve(),
        allowed_origins=[origin.strip() for origin in allowed_origins_raw.split(",") if origin.strip()],
        llm_model=os.getenv("CHAT_LLM_MODEL", "openai/gpt-oss-120b:free"),
        llm_base_url=os.getenv("CHAT_LLM_BASE_URL", "https://openrouter.ai/api/v1"),
        api_key_env=os.getenv("CHAT_API_KEY_ENV", "OPENROUTER_API_KEY_RAG"),
    )

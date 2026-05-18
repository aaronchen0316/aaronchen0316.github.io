# Aaron Portfolio Chat API

Separate backend for the GitHub Pages frontend.

## What it does
- loads authored profile markdown from `chat_api/content/profile`
- reuses local paper PDFs from `/Users/aaronchen/Documents/Code/learning/RAG_paper/data/pdf` by default
- builds a Chroma vector store
- answers only portfolio-related questions
- streams responses as Server-Sent Events
- logs minimal analytics only

## Environment
- `OPENROUTER_API_KEY_RAG`: required for chat generation
- `CHAT_PDF_DIR`: optional override for research-paper directory
- `CHAT_PROFILE_DIR`: optional override for authored profile docs
- `CHAT_VECTOR_STORE_DIR`: optional override for Chroma persistence
- `CHAT_ALLOWED_ORIGINS`: comma-separated frontend origins
- `CHAT_LLM_MODEL`: optional override, default `openai/gpt-oss-120b:free`
- `CHAT_ALLOW_EMBEDDING_DOWNLOAD`: set to `1` only if the embedding model is not cached locally and you want `app.ingest` to download it

## Local run
```bash
cd chat_api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m app.ingest
uvicorn app.server:app --reload
```

By default, `app.ingest` now loads the embedding model from the local Hugging Face cache only. This avoids long network retry hangs in offline or restricted environments. If the model is not cached yet, set `CHAT_ALLOW_EMBEDDING_DOWNLOAD=1` for the first ingest run.

## Frontend connection
Set repo-root `.env` or shell var:

```bash
VITE_CHAT_API_URL=http://localhost:8000
```

When the Vite frontend is running on `localhost` or `127.0.0.1`, it will fall back to `http://localhost:8000` automatically if `VITE_CHAT_API_URL` is unset. Deployed frontend builds still need an explicit `VITE_CHAT_API_URL`.

## Production shape
- frontend: GitHub Pages
- backend: Railway / Render / similar Python host
- if deployment host cannot see local PDF path, copy PDFs into a deployment-accessible directory and set `CHAT_PDF_DIR`

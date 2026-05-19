# Aaron Portfolio

Personal portfolio frontend in React + Vite, designed for GitHub Pages.

## Architecture
- `src/`: portfolio frontend
- `chat_api/`: separate Python chat backend
- `chat_api/data/pdf/`: repo-local public paper corpus for backend ingestion and cloud deploys
- `plan.md`: implementation plan for portfolio + chatbot v1
- `memory/`: repo-local working memory and decisions

## Frontend
```bash
npm install
npm run dev
```

To connect live chat locally, set:

```bash
VITE_CHAT_API_URL=http://localhost:8000
```

If `VITE_CHAT_API_URL` is not set, the frontend will automatically target `http://localhost:8000` when running on `localhost` or `127.0.0.1`. Production still needs an explicit `VITE_CHAT_API_URL`.

## Chat API
See [chat_api/README.md](/Users/aaronchen/Documents/Code/aaronchen0316.github.io/chat_api/README.md).

Typical local flow:

```bash
cd chat_api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m app.ingest
uvicorn app.server:app --reload
```

## Deployment shape
- frontend -> GitHub Pages
- chat backend -> separate Python host such as Railway or Render

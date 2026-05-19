# Implement Aaron Portfolio + Chatbot V1

## Summary
- Keep frontend in current React/Vite repo on GitHub Pages.
- Build separate chat API service backed by personal corpus retrieval.
- Redesign site as one-page anchored portfolio with sections: `Home`, `Projects`, `Experience`, `Hobbies`, `Contact`.
- Use editorial research-studio visual system. Distinct from friend site. No 1:1 theme/layout copy.
- During execution, write this plan to `plan.md`.
- During execution, create repo-local `memory/` and update it per AGENTS rules.

## Key Changes
- Frontend
  - Replace current inline-style pattern with reusable layout/content components plus shared theme tokens in CSS.
  - Keep one-page nav. Add missing `Experience` section.
  - Split `Projects` into `Research` and `Engineering`.
  - Add chatbot UI with floating trigger, starter prompts, loading/error states, source labels, mobile-safe layout.
- Content
  - Create structured local content source for non-paper material: bio, experience themes, engineering projects, hobbies, contact.
  - Reuse PDFs already in `/Users/aaronchen/Documents/Code/learning/RAG_paper/data/pdf` for research corpus.
  - Index both authored profile docs and research papers into one personal corpus.
- Chat backend
  - Adapt `/Users/aaronchen/Documents/Code/learning/RAG_paper` into deployable API instead of cloning friend backend shape blindly.
  - Add `POST /chat` and `GET /health`.
  - Enforce personal-corpus-only responses with refusal/redirect for off-topic or private-life questions.
  - Enable frontend CORS for GitHub Pages domain and localhost.
  - Record minimal analytics only: timestamp, coarse topic, latency, success/failure.
- Docs + memory
  - Create `plan.md` at repo root from this plan.
  - Create `CONTEXT.md`.
  - Create `memory/` files:
    - `memory/project.md`
    - `memory/logs/2026-05-15.md`
    - `memory/progress/todo.md`
    - `memory/progress/progress.md`
    - `memory/decisions/portfolio-chatbot-v1.md`
    - `memory/architecture/objective.md`
    - `memory/architecture/knowledge.md`
  - After memory updates, run `qmd update`.

## Public Interfaces / Types
- Frontend anchors
  - `#home`
  - `#projects`
  - `#experience`
  - `#hobbies`
  - `#contact`
- Structured content contract
  - Bio summary data
  - Experience entries with org/theme, role/focus, period, summary, highlights
  - Project entries with type, title, summary, tags, links, asset refs
  - Hobbies/contact items
- Chat API
  - `POST /chat`
  - Request: `query`, optional `history`
  - Response: SSE token stream with final source metadata payload
  - `GET /health`
- Retrieval output
  - Answer text
  - Source metadata for paper/profile grounding
  - Optional source labels for UI rendering

## Execution Sequence
- Phase 1
  - Write `plan.md`
  - Create `memory/` scaffold and seed objective/progress/decision files
  - Inspect current frontend and RAG repo in more detail before code edits
- Phase 2
  - Refactor frontend structure, theme system, section data model
  - Implement redesigned sections and project split
  - Wire chatbot shell UI
- Phase 3
  - Convert existing RAG CLI into API service
  - Add corpus ingestion path for authored profile docs plus papers
  - Add scope guardrails, health check, CORS, minimal analytics
- Phase 4
  - Connect frontend chat UI to API
  - Add deploy config/docs for split hosting
  - Verify GitHub Pages build plus local API integration shape
- Phase 5
  - Update memory files with final decisions, progress, known follow-ups
  - Run `qmd update`

## Test Plan
- Frontend
  - Desktop/mobile render for all sections
  - Nav anchor behavior
  - Chat widget open/close/input/stream/error flows
  - Research vs engineering project grouping
- Backend
  - Health endpoint
  - CORS from localhost and Pages domain
  - Happy-path answer for background, experience, paper, project questions
  - Refusal for off-topic or personal/private questions
  - Graceful behavior on empty retrieval and upstream model failure
- End to end
  - Frontend build passes
  - Deployed static site reaches live API
  - Representative prompts answer from grounded corpus

## Assumptions / Defaults
- `initial_objective.md` remains source-of-truth.
- Custom domain out of scope for v1.
- No `implementation.md` unless domain/payment scope returns later.
- Friend site serves as capability/reference only.
- React/Vite remains frontend stack.
- Split hosting remains required because GitHub Pages cannot host server-side RAG API.

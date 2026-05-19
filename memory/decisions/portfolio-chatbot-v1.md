# Portfolio Chatbot V1 Decisions

## 2026-05-15: Split static frontend from chat backend
- Keep React/Vite frontend on GitHub Pages.
- Host chat API separately because GitHub Pages cannot run retrieval, embeddings, or LLM-backed endpoints.

## 2026-05-15: Use personal-corpus-only chat scope
- Chat should answer only questions grounded in Aaron's profile docs and research papers.
- Off-topic, private-life, and unsupported questions should be redirected instead of answered freely.

## 2026-05-15: Represent experience as themes in v1
- Current repo lacks authoritative employer-by-employer resume data.
- V1 site uses capability-based experience cards to avoid fabricating specifics while still satisfying `Experience` navigation and content goals.

## 2026-05-15: Default local chat frontend to localhost backend
- When `VITE_CHAT_API_URL` is unset, local frontend sessions on `localhost` or `127.0.0.1` should target `http://localhost:8000`.
- Production builds still require an explicit `VITE_CHAT_API_URL`; the UI should show a normal offline state instead of exposing raw config-variable names.

## 2026-05-15: Do not hardcode fallback chat answers in the frontend
- If the deployed backend is unreachable, the frontend should show generic unavailable/error messaging rather than authored answer text.
- All substantive answers should come from the live backend path, not from question-specific frontend fallbacks.

## 2026-05-15: Load embedding model from local cache by default
- `app.ingest` should prefer the local Hugging Face cache and only attempt an initial model download when `CHAT_ALLOW_EMBEDDING_DOWNLOAD=1` is set.
- This keeps local and CI-like environments from hanging on repeated network retries when offline or sandboxed.

## 2026-05-15: Chat widget uses frontend-owned single paper reference line
- Frontend renders at most one reference sentence in the exact format `To know more, please see <title>.`
- Show that line only when top source is a paper. Profile-doc answers do not show a reference footer.

## 2026-05-15: Chat answers should read like short conversation, not retrieved notes
- Backend prompt should bias toward natural prose, short direct sentences, and fewer than 150 words.
- Markdown-style lists, bold markers, and source dumps should be suppressed in generation and cleaned up defensively.

## 2026-05-17: Portfolio homepage should default to a modest professional tone
- The landing hero should lead with `Aaron Chen` as the primary heading and place the capability line beneath it.
- Remove side-panel framing such as `Current lens` and hero stats when it makes the homepage read as promotional.
- Section headings and descriptions should state focus areas directly and avoid defensive or self-promotional wording.

## 2026-05-17: Projects section should act as the visual centerpiece
- Keep the two-track `Research` / `Engineering` structure in the UI.
- Treat `Research` as the papers track and show all seven papers already present in the personal corpus.
- Use a shared carousel interaction for both tracks, but let only the centered active card carry the full summary/CTA state.
- Updated UI refinement: desktop carousel keeps 3 full visible cards without overlap and adds 2 smaller faded ghost cards at the far edges.
- Updated UI refinement: `Research` cards should not show summaries; they still keep the `View paper` action.

## 2026-05-17: Resume knowledge should be normalized into profile markdown before embedding
- Resume `.docx` files should not be indexed raw. Extract and merge them into authoritative markdown under `chat_api/content/profile/`.
- Resume publications should stay out of those markdown docs because the chatbot already has a dedicated paper corpus.

## 2026-05-18: Guardrail should be evidence-based, not keyword-allowlist based
- Keep a deterministic blocklist for clearly private or disallowed topics.
- For normal questions, run retrieval first and only answer when corpus evidence is strong enough.
- Biography, education, and work-history questions should require strong profile/resume evidence instead of handcrafted allowlist keywords.

## 2026-05-18: Chat prose should minimize hyphen usage
- Prompt the model to avoid hyphen-heavy phrasing and prefer plain sentence structure unless a hyphen is necessary for correctness.

## 2026-05-18: Resume/profile retrieval should be section-aware with lexical rescue
- Profile markdown should be indexed section-by-section instead of as one long document so school-, employer-, and project-specific questions retrieve the correct subsection.
- The personal corpus is small enough that retrieval can combine embedding search with a lightweight lexical rescue pass for exact school, employer, title, and thesis terms.

## 2026-05-18: Recruiter-style eval should be a checked-in backend regression gate
- Keep a deterministic 50-question recruiter/hiring-manager evaluation suite under backend tests.
- Judge success primarily through retrieval evidence, scope decisions, and required grounded context, not through live LLM calls.

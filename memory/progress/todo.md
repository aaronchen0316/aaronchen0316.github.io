# Todo

- Gather richer first-party biography, resume, and engineering project details to replace v1 authored placeholders.
- Add automated frontend tests; backend now has recruiter-eval, guard, formatting, ingest, and health runtime coverage.
- Deploy chat API and set `VITE_CHAT_API_URL` for production.
- Decide whether to add custom domain and API subdomain after v1 stabilization.
- Repair local frontend dependency state so `npm run dev` can load Rollup on this machine.
- Do browser-based visual QA of the updated homepage hero and experience-card spacing on desktop and mobile when a local/live frontend target is available.
- Do browser-based visual QA of the new projects carousel on desktop and mobile, especially side peeks, opacity states, and tab switching between Research and Engineering.
- Consider replacing the static chat status badge with a real backend health check if production uptime feedback becomes important.
- Do visual QA on live/local chat widget in browser once preferred backend is reachable, especially mobile height and long-answer scroll behavior.
- Decide whether the merged resume markdown should also replace or enrich visible site section copy, or remain chatbot-only knowledge.

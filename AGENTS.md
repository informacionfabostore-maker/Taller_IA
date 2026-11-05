# EcoMarket project guidance

## Shared work
- The repository files and current working tree are the shared source of truth; separate Copilot and Codex chats do not share private conversation history.
- Before editing, inspect the current files and preserve changes made by the user or another agent. Avoid editing the same files concurrently.
- When handing work between agents, update `docs/ai-handoff.md` with the task status, decisions, changed files, and next step. Do not record credentials or private data.

## Project context
- Read `README.md` and the relevant documentation in `docs/` before making project changes.
- This is a Spanish-language academic EcoMarket MVP built with vanilla HTML, CSS, and JavaScript. Do not add a framework unless requested.
- Keep the UI responsive and accessible. Product data is fictional; preserve the schema and validation rules in `productos.json` and `validacion.js`.
- `index.html` must work both when opened directly and through Live Server. `productos.js` provides the local-file catalog fallback and must stay synchronized with `productos.json`.

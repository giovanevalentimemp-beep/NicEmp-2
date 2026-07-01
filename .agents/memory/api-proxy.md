---
name: API proxy
description: How the frontend talks to the API server in dev
---
Vite config (artifacts/nicemp/vite.config.ts) proxies /api → http://localhost:8080.
Both workflows must run: "artifacts/nicemp: web" (port 21620) + "artifacts/api-server: API Server" (port 8080).
**Why:** Frontend is Vite SPA, API server is Express. Proxy avoids CORS issues in dev.
**How to apply:** For production deployment, set VITE_API_URL env var and update cms-api.ts BASE.

# Nicemp Ferramentas

Plataforma de ferramentas financeiras, tributárias e de gestão para empreendedores brasileiros.

## Run & Operate

- `artifacts/nicemp: web` workflow — Vite dev server (port 21620, preview at `/`)
- `pnpm --filter @workspace/nicemp run typecheck` — typecheck the frontend
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS + shadcn/ui (artifact: `nicemp`)
- Auth & DB: Supabase (external — no local Postgres)
- Router: Wouter
- Charts: Recharts
- Animation: Framer Motion

## Where things live

- `artifacts/nicemp/src/App.tsx` — all routes
- `artifacts/nicemp/src/pages/` — all pages
- `artifacts/nicemp/src/components/` — Header, Footer, sections, ds/, auth/
- `artifacts/nicemp/src/lib/simples-nacional/` — Simples Nacional engine + Anexos I–V
- `artifacts/nicemp/src/hooks/use-auth.tsx` — AuthProvider + useAuth
- `artifacts/nicemp/src/services/` — Supabase client, auth service, profile service
- `artifacts/nicemp/src/config/env.ts` — env var access + `isSupabaseConfigured` guard

## Architecture decisions

- Frontend-only (no Express API needed) — Supabase handles auth and database directly from the browser
- `isSupabaseConfigured` guard wraps all Supabase calls; login page shows a warning banner when env vars are missing instead of crashing
- Admin detection: `profile.role === "admin"` in the `public.users` table (not Supabase metadata)
- Tool config (Simples Nacional tables, Markup/ROI examples) stored in `localStorage` — editable in `/admin` under "Configuração das Ferramentas"
- ProtectedRoute checks user → CPF → adminOnly in that order; missing CPF redirects to `/completar-cpf`

## Product

- `/` — Marketing homepage (hero, tools, solutions, blog, premium sections)
- `/ferramentas` — Tool directory
- `/roi`, `/markup`, `/impostos/simples-nacional` — Free calculators
- `/aprenda`, `/aprenda/:slug` — Blog / learn articles
- `/entrar` — Login (Google OAuth + email/password)
- `/gerencie` — Protected executive dashboard (DRE, fluxo de caixa, indicadores)
- `/admin` — Admin panel with CMS + "Configuração das Ferramentas" (Simples Nacional faixas + Markup/ROI presets)

## User preferences

- Preserve existing aesthetics exactly when migrating source files

## Gotchas

- Supabase env vars must be set for auth/login to work; without them the app still renders fully but login buttons are disabled
- Admin user must be set in the DB: `UPDATE public.users SET role = 'admin' WHERE email = 'nicemp.admin@gmail.com'`
- The Supabase `public.users` table must have: `id uuid`, `email text`, `nome text`, `cpf text`, `avatar_url text`, `role text` (default `'user'`), `created_at`, `updated_at`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

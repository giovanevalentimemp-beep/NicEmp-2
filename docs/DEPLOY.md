# Deploy

## Build local

```bash
pnpm install
pnpm run build
```

## Vercel

1. Configure as variaveis:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SITE_NAME=NICEMP
```

2. Build command:

```bash
pnpm run build
```

3. Output directory:

```text
dist
```

4. O `vercel.json` ja redireciona rotas SPA para `index.html`.

## Pos-deploy

- Confirme que `/entrar` abre o login.
- Confirme que Google OAuth retorna para `/auth/callback`.
- Confirme que primeiro acesso redireciona para `/completar-cpf`.
- Promova administradores no banco:

```sql
update public.users
set role = 'admin'
where email = 'admin@dominio.com';
```

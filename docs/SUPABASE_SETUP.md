# Configuracao do Supabase

## 1. Criar projeto

1. Crie um projeto no Supabase.
2. Copie a Project URL e a anon public key.
3. Crie `.env.local`:

```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
```

## 2. Aplicar migrations

No Supabase SQL Editor, execute:

```sql
-- arquivo:
-- supabase/migrations/20260623160000_initial_nicemp_schema.sql
```

Ou via CLI:

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

## 3. Estrutura criada

- `users`: id, email, nome, cpf, avatar_url, role, created_at, updated_at.
- `profiles`: dados complementares do usuario.
- `posts`: CMS do Aprenda.
- `categories`: categorias do CMS.
- `post_images`: galeria de posts.
- `videos`: videos YouTube.
- `companies`: multiempresa por usuario.
- `dre_entries`: linhas de DRE por empresa.
- `cashflow_entries`: entradas e saidas por empresa.
- `indicators`: indicadores executivos por empresa.

## 4. CPF

- `users.cpf` e `UNIQUE`.
- O banco exige CPF formatado como `000.000.000-00`.
- A funcao `public.is_valid_cpf` valida digitos verificadores.
- A aplicacao tambem valida e mascara CPF no frontend.

## 5. RLS

- Usuarios acessam apenas o proprio perfil.
- Administradores acessam dados administrativos.
- Empresas, DRE, fluxo de caixa e indicadores ficam isolados por `owner_id`.
- Posts publicados podem ser lidos publicamente.
- Escrita de CMS e categorias e restrita a administradores.

## 6. Storage

- Bucket criado: `media`.
- Leitura publica.
- Upload autenticado.
- Exclusao pelo dono do objeto ou administrador.

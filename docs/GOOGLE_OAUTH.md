# Configuracao Google OAuth

## Google Cloud

1. Acesse Google Cloud Console.
2. Crie ou selecione um projeto.
3. Configure a OAuth consent screen.
4. Crie credenciais OAuth Client ID do tipo Web application.
5. Adicione as URLs autorizadas:

```text
https://SEU-PROJETO.supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
https://SEU-DOMINIO/auth/callback
```

## Supabase

1. Acesse Authentication > Providers.
2. Habilite Google.
3. Cole Client ID e Client Secret.
4. Em URL Configuration, adicione:

```text
http://localhost:5173/auth/callback
https://SEU-DOMINIO/auth/callback
```

## Fluxo implementado

1. Usuario clica em `Entrar com Google`.
2. Supabase inicia OAuth.
3. Callback retorna para `/auth/callback`.
4. A aplicacao cria/atualiza `users`.
5. Se `cpf` estiver vazio, redireciona para `/completar-cpf`.
6. CPF valido e salvo no formato unico.
7. Usuario segue para `/gerencie`.

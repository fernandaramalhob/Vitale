# Vitale
Vitale - Plataforma SaaS multi-tenant para gestao clinica com modulos de CRM, agendamentos, prontuarios e dashboards.

## Autenticacao com Supabase

O login e o cadastro usam o Supabase Auth.

1. Crie um projeto no Supabase.
2. Abra `Project Settings > API`.
3. Copie a `Project URL` e a `publishable key`.
4. Coloque no arquivo `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://uldblllyvfnjudrinfsx.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_hyjGSmmQdSHUl2PHtfsRlg_MOlUynN8"
```

Se quiser persistir outros dados do sistema em Postgres, o arquivo [`supabase-schema.sql`](C:\great-vitale\Vitale\supabase-schema.sql) continua disponivel como base para tabelas internas do app.

## Observacao importante

Se o Supabase estiver com confirmacao de e-mail ativa, o cadastro pode exigir verificacao antes do primeiro acesso. Nesse caso, o usuario precisa confirmar o link enviado por e-mail e depois entrar normalmente.

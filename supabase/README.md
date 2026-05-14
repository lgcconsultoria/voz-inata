# Supabase — banco do Voz Inata

Schema e políticas baseados na **Skill 08** (ver `../08_Banco_Dados.md`).

## Estrutura

```
supabase/
└── migrations/
    ├── 0001_init.sql            Enums + 27 tabelas + índices base
    ├── 0002_functions.sql       Funções e triggers (updated_at, regras de post,
    │                            handle_new_user, sync_plan, badge "ativa")
    ├── 0003_rls.sql             Row Level Security (24 políticas)
    ├── 0004_indexes_search.sql  Índices adicionais e full-text search PT-BR
    └── 0005_seed.sql            Cupons Oferta Fundadora + conteúdos iniciais
```

## Como aplicar (3 opções)

### Opção A — Supabase CLI local (recomendado)

```bash
# 1. instale a CLI
brew install supabase/tap/supabase

# 2. faça login
supabase login

# 3. linke o projeto (após criar via dashboard)
supabase link --project-ref <project-ref>

# 4. aplique as migrations
supabase db push
```

### Opção B — Dashboard do Supabase (mais simples para começar)

1. Crie um projeto novo em https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo de cada arquivo na ordem (0001 → 0005), executando um por vez
4. Confirme em **Table Editor** que as 27 tabelas foram criadas

### Opção C — psql direto

```bash
psql "$DATABASE_URL" -f migrations/0001_init.sql
psql "$DATABASE_URL" -f migrations/0002_functions.sql
psql "$DATABASE_URL" -f migrations/0003_rls.sql
psql "$DATABASE_URL" -f migrations/0004_indexes_search.sql
psql "$DATABASE_URL" -f migrations/0005_seed.sql
```

## Pós-instalação

1. Crie sua conta admin pelo fluxo de signup do app
2. Pegue o UUID com `SELECT id, email FROM auth.users WHERE email = 'seu@email.com';`
3. Promova-se a admin:
   ```sql
   UPDATE profiles SET role = 'admin', current_plan = 'mentora'
    WHERE id = '<seu-uuid>';
   ```
4. Configure Auth Providers em **Authentication → Providers** (Email + Google opcional)
5. Configure Storage Buckets conforme a Skill 08 §5

## Storage Buckets

| Bucket | Público? | Tamanho máx |
|---|---|---|
| `avatars` | público | 2 MB |
| `business-logos` | público | 2 MB |
| `business-gallery` | público | 4 MB |
| `posts-images` | público | 4 MB |
| `event-covers` | público | 4 MB |
| `event-recordings` | privado | sem limite |
| `content-pdfs` | privado | 20 MB |
| `internal-assets` | privado | — |

Crie cada bucket em **Storage** → **New bucket** com as flags acima.

## Regras de negócio implementadas no banco

- `enforce_post_business_rules`: bloqueia Divulgação para Voz, limita a 2/semana para Inata/Mentora, restringe tipos `*_admin` a roles admin/moderator
- `handle_new_user`: cria perfil + selo "Recém-chegada" automaticamente após signup
- `sync_profile_current_plan`: mantém `profiles.current_plan` sincronizado com a assinatura ativa
- `inc_post_counters`: contadores de `reactions_count` e `comments_count` em `posts`
- `maybe_award_active_badge`: helper chamado em cron para atribuir selo "Ativa"
- RLS: cada tabela tem políticas que isolam dados entre usuárias e garantem gating por plano

# Voz Inata — Arquitetura de Software

**Skill 07 — Arquiteto de Software**
**Data:** 14 de maio de 2026
**Status:** Concluída — pronta para alimentar Skill 08 (Banco) e geração do repositório
**Documentos anteriores:** Skills 01, 02, 03, 04

---

## Filosofia da Decisão

**Tecnologia "boring" sobre tecnologia hype.** O Voz Inata precisa rodar em 3–4 meses com R$ 10k–30k. Cada decisão privilegia: (1) velocidade de entrega, (2) custo operacional baixo, (3) curva de aprendizado moderada, (4) ecossistema maduro com soluções prontas.

A stack escolhida é praticamente o padrão SaaS BR 2026 e tem dezenas de repositórios de referência open-source.

---

## 1 — Stack Definitiva

| Camada | Tecnologia | Justificativa curta |
|---|---|---|
| **Framework full-stack** | **Next.js 14 (App Router)** | SSR para SEO, RSC para performance, Server Actions para mutações, ecossistema gigante |
| **Linguagem** | **TypeScript 5** | Type safety end-to-end, integra nativo com Supabase types |
| **UI / Estilo** | **Tailwind CSS 3** + **shadcn/ui** | Tailwind para utilitários; shadcn é coleção de componentes copy-paste (não dependência), 100% customizáveis com a paleta da Skill 04 |
| **Banco + Auth + Storage** | **Supabase** (PostgreSQL 15) | PostgreSQL real, RLS para segurança por linha, Auth nativo, Storage com CDN, free tier suficiente para validação |
| **Pagamentos** | **Stripe** (decisão do usuário) | Maduro, ótimo DX, cartão recorrente impecável. ⚠️ Ver nota sobre Pix recorrente abaixo |
| **E-mail transacional** | **Resend** | API limpa, React Email para templates, 3.000 e-mails/mês gratuitos |
| **Hospedagem** | **Vercel** (frontend + APIs) + **Supabase Cloud** (banco) | Zero DevOps, preview deploys por PR, rollback em 1 clique |
| **Monitoramento** | **Vercel Analytics** + **Sentry** + **PostHog** (V1.5) | Trio padrão. Sentry no MVP, PostHog quando houver volume |
| **CI/CD** | **GitHub Actions** + Vercel auto-deploy | Test + lint + type-check no PR; deploy automático no merge |

### ⚠️ Nota crítica sobre Stripe e Pix recorrente

Stripe Brasil **suporta Pix avulso**, mas **Pix recorrente real ainda é limitado** (em rollout via Stripe Subscriptions com Pix, exige cadastro completo de PJ BR, em algumas regiões só funciona com cartão+Pix fallback). Para uma comunidade B2C, isso pode virar atrito de conversão.

**Solução adotada no código:** abstração de gateway via interface `PaymentProvider`. O MVP roda em Stripe; se a taxa de Pix for crítica para conversão, troca-se a implementação concreta para **Asaas** ou **Pagar.me** em ~2 dias sem refatorar o restante da aplicação.

```typescript
// lib/payments/types.ts
export interface PaymentProvider {
  createCustomer(data: CustomerData): Promise<Customer>
  createSubscription(input: SubscriptionInput): Promise<Subscription>
  cancelSubscription(id: string): Promise<void>
  pauseSubscription(id: string, until: Date): Promise<void>
  verifyWebhook(payload: string, signature: string): boolean
  // ...
}

// lib/payments/stripe.ts → implementa PaymentProvider
// lib/payments/asaas.ts → implementação alternativa (só ativa se ENV=asaas)
```

---

## 2 — Arquitetura de Alto Nível

```
┌──────────────────────────────────────────────────────────────┐
│                      USUÁRIA (Browser / PWA)                  │
│                  Next.js 14 (RSC + Client Components)         │
│  Landing · Dashboard · Mural · Biblioteca · Agenda · Catálogo │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTPS (Vercel Edge)
┌──────────────────────────▼───────────────────────────────────┐
│  Next.js Server Actions  +  API Routes  (na própria Vercel)   │
│  /api/webhooks/stripe   /api/webhooks/resend   /api/cron/*    │
└─────┬───────────────┬─────────────────┬──────────────────────┘
      │               │                 │
┌─────▼──────┐  ┌─────▼──────┐  ┌──────▼─────────┐
│  Supabase  │  │   Stripe   │  │     Resend     │
│  Postgres  │  │  Payments  │  │   E-mails      │
│  Auth+RLS  │  │  Webhooks  │  │   transacional │
│  Storage   │  └────────────┘  └────────────────┘
│  Realtime  │
└────────────┘

Cron jobs (Vercel Cron):
  • Diário 8h: gatilhos anti-churn (Skill 02) — inativas, dia 5, dia 14
  • Diário 10h: pré-renovação (D-3) — "seu mês em números"
  • Domingo 19h: e-mail digest semanal
  • Mensal dia 1: post de Boas-vindas Coletivas + Voz do Mês
```

---

## 3 — Estrutura de Pastas

```
voz-inata/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # lint + typecheck + test
│       └── deploy-preview.yml
├── app/                            # Next.js App Router
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing /
│   │   ├── planos/page.tsx
│   │   ├── palco/page.tsx          # SEO V1.5
│   │   ├── entrar/page.tsx
│   │   ├── cadastro/page.tsx       # Checkout
│   │   ├── esqueci-senha/page.tsx
│   │   ├── termos/page.tsx
│   │   └── privacidade/page.tsx
│   ├── (auth)/                     # Protegido por middleware
│   │   ├── layout.tsx              # Sidebar/Bottom nav
│   │   ├── casa/page.tsx           # Dashboard
│   │   ├── mural/
│   │   │   ├── page.tsx
│   │   │   ├── fama/page.tsx
│   │   │   └── post/[id]/page.tsx
│   │   ├── biblioteca/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── agenda/
│   │   │   ├── page.tsx
│   │   │   ├── evento/[id]/page.tsx
│   │   │   └── gravacoes/page.tsx
│   │   ├── catalogo/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── perfil/
│   │   │   ├── page.tsx
│   │   │   ├── meu-mes/page.tsx
│   │   │   └── assinatura/page.tsx
│   │   └── notificacoes/page.tsx
│   ├── (admin)/                    # Protegido por role admin
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx            # Dashboard métricas
│   │       ├── assinantes/page.tsx
│   │       ├── biblioteca/page.tsx
│   │       ├── eventos/page.tsx
│   │       ├── mural/page.tsx      # Moderação
│   │       ├── catalogo/page.tsx
│   │       ├── destaques/page.tsx
│   │       ├── cupons/page.tsx
│   │       ├── marcas-aliadas/page.tsx
│   │       ├── comunicados/page.tsx
│   │       └── configuracoes/page.tsx
│   ├── api/
│   │   ├── auth/[...all]/route.ts  # Supabase callback
│   │   ├── webhooks/
│   │   │   ├── stripe/route.ts
│   │   │   └── resend/route.ts
│   │   ├── cron/
│   │   │   ├── anti-churn/route.ts
│   │   │   ├── pre-renewal/route.ts
│   │   │   └── digest/route.ts
│   │   └── og/route.tsx            # Open Graph images (Voz do Mês)
│   ├── globals.css
│   └── layout.tsx                  # Root layout (fonts, providers)
├── components/
│   ├── ui/                         # shadcn/ui (button, card, dialog, etc.)
│   ├── layout/
│   │   ├── sidebar-nav.tsx
│   │   ├── bottom-nav.tsx
│   │   ├── header.tsx
│   │   └── footer-public.tsx
│   ├── home/
│   │   ├── greeting-card.tsx
│   │   ├── onboarding-trail.tsx
│   │   └── next-event-banner.tsx
│   ├── mural/
│   │   ├── post-card.tsx
│   │   ├── post-composer.tsx       # Modal de 3 passos
│   │   ├── post-anchor.tsx         # Post-âncora fixo
│   │   ├── post-type-chip.tsx
│   │   └── comments-thread.tsx
│   ├── library/
│   │   ├── content-card.tsx
│   │   └── video-player.tsx        # Embed Vimeo/Mux
│   ├── agenda/
│   │   ├── week-view.tsx
│   │   ├── event-card.tsx
│   │   └── rsvp-button.tsx
│   ├── catalog/
│   │   ├── business-card.tsx
│   │   ├── business-filters.tsx
│   │   └── featured-business.tsx
│   ├── profile/
│   │   ├── badges-grid.tsx         # 5 selos
│   │   ├── month-stats.tsx         # "Seu mês em números"
│   │   └── cancel-wizard.tsx       # 3 passos sem dark pattern
│   ├── checkout/
│   │   ├── plan-selector.tsx
│   │   └── payment-form.tsx
│   ├── upsell/
│   │   ├── upsell-modal.tsx
│   │   └── upsell-banner.tsx
│   └── admin/
│       └── …
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # browser client
│   │   ├── server.ts               # server client (RSC + API)
│   │   ├── middleware.ts           # session refresh
│   │   └── service-role.ts         # admin operations (cron, webhooks)
│   ├── payments/
│   │   ├── types.ts                # interface PaymentProvider
│   │   ├── stripe.ts               # implementação Stripe
│   │   ├── webhook-handler.ts
│   │   └── plans.ts                # catálogo de planos
│   ├── email/
│   │   ├── resend.ts
│   │   └── templates/              # React Email
│   │       ├── welcome.tsx
│   │       ├── month-summary.tsx
│   │       ├── pre-renewal.tsx
│   │       ├── payment-failed.tsx
│   │       └── digest-weekly.tsx
│   ├── auth/
│   │   ├── session.ts
│   │   └── permissions.ts          # canPostDivulgation(), canAccessPalco()
│   ├── analytics/
│   │   └── events.ts               # tracker para PostHog/Vercel
│   ├── validators/                 # zod schemas
│   │   ├── post.ts
│   │   ├── profile.ts
│   │   └── subscription.ts
│   └── utils/
│       ├── cn.ts                   # classnames helper
│       ├── date.ts                 # date-fns pt-BR
│       └── slug.ts
├── middleware.ts                    # proteção de rotas
├── supabase/
│   ├── migrations/                 # Skill 08 popula aqui
│   ├── seed.sql
│   └── config.toml
├── types/
│   ├── database.types.ts           # gerado via `supabase gen types`
│   └── domain.ts
├── public/
│   ├── logo.svg
│   ├── og-default.png
│   └── manifest.json               # PWA
├── .env.example
├── .env.local                      # gitignored
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4 — Fluxo de Autenticação

```
1. Usuária acessa rota /(auth)/* → middleware.ts intercepta
2. middleware lê cookie sb-access-token (Supabase Auth)
3. Sem cookie ou expirado → redirect 302 → /entrar?next=<path>
4. Login (email/senha):
   - Client chama supabase.auth.signInWithPassword()
   - Supabase retorna { user, session } → cookie httpOnly setado
   - Redirect para /casa (ou ?next=<path>)
5. Em cada request server-side:
   - createServerClient lê cookie
   - getUser() valida sessão + retorna user
   - Permissões (plano, role) buscadas de profiles via RLS
6. Refresh automático: middleware troca refresh_token se access expirou
7. Logout: supabase.auth.signOut() → limpa cookie + redirect /
```

**Magic Link e Google OAuth** ficam habilitados no Supabase mas não são CTA do MVP — Google OAuth fica como opção secundária no /entrar (sem fricção, baixo custo).

---

## 5 — Fluxo de Pagamento (Stripe Subscriptions)

```
CRIAÇÃO DE ASSINATURA
1. Usuária preenche cadastro + escolhe plano (Voz/Inata/Mentora)
2. POST /api/checkout → Server Action createCheckoutSession()
3. Server cria customer no Stripe (ou recupera por email)
4. Server cria stripe.checkout.Session em modo subscription
   - line_items: priceId conforme plano
   - metadata: { user_id, plan, founder_offer: true/false }
5. Retorna URL de checkout hospedado pela Stripe
6. Usuária paga (cartão / Pix /  boleto*)
7. Stripe redireciona → /cadastro/sucesso?session_id=…
8. Stripe envia evento checkout.session.completed → webhook
9. Webhook → /api/webhooks/stripe:
   - Valida assinatura HMAC do Stripe
   - Upsert na tabela subscriptions com status='active'
   - Trigger insert em onboarding_events (D1)
   - Envia welcome via Resend

EVENTOS DO WEBHOOK A TRATAR
  checkout.session.completed       → ativa assinatura
  customer.subscription.updated    → upgrade/downgrade
  customer.subscription.deleted    → cancelamento
  invoice.payment_succeeded        → renovação OK
  invoice.payment_failed           → fluxo D+0/D+2/D+5 (suspende D+7)
  customer.subscription.paused     → pausa de 60 dias

* Boleto: rota de exceção, não recorrente — usado só em campanhas
  específicas (ex.: Black Friday). Stripe não recorrência boleto BR.
```

**Idempotência:** todo handler de webhook verifica `event.id` contra tabela `webhook_events` antes de processar (evita double-processing).

---

## 6 — Controle de Acesso (Middleware + RLS)

A segurança é **dupla**: middleware Next.js + Row Level Security no Postgres. Nunca confiar só no front-end.

```typescript
// middleware.ts (simplificado)
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const { supabase, response } = createMiddlewareClient(req)
  const { data: { user } } = await supabase.auth.getUser()

  if (isPublic(pathname)) return response
  if (!user) return redirectTo(req, '/entrar', { next: pathname })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, current_plan, subscription_status')
    .eq('id', user.id)
    .single()

  if (isAdmin(pathname) && profile?.role !== 'admin') {
    return redirectTo(req, '/casa')
  }
  if (isAuthenticated(pathname) && profile?.subscription_status !== 'active') {
    return redirectTo(req, '/perfil/assinatura')
  }

  return response
}
```

**Gating por plano dentro das telas** (ex.: bloquear "Divulgação do Negócio" para Voz) **acontece na Server Action / API**, não no client:

```typescript
// lib/auth/permissions.ts
export const canPostDivulgation = (plan: Plan) =>
  plan === 'inata' || plan === 'mentora'

export const canApplyToPalco = (plan: Plan, monthsActive: number) =>
  plan === 'mentora' || (plan === 'inata' && monthsActive >= 6)
```

E **no banco** via RLS, como cinto de segurança final:

```sql
-- exemplo (Skill 08 detalha)
create policy "only premium can post divulgation"
on posts for insert
with check (
  type != 'divulgation' or
  exists (select 1 from profiles
          where id = auth.uid() and current_plan in ('inata','mentora'))
);
```

---

## 7 — Variáveis de Ambiente

```bash
# .env.example
# ─── Supabase ───
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only, nunca expor

# ─── Stripe ───
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_VOZ_MONTHLY=
STRIPE_PRICE_VOZ_YEARLY=
STRIPE_PRICE_INATA_MONTHLY=
STRIPE_PRICE_INATA_YEARLY=
STRIPE_PRICE_MENTORA_MONTHLY=
STRIPE_PRICE_MENTORA_YEARLY=
STRIPE_PRICE_VOZ_FOUNDER=           # Oferta Fundadora vitalícia
STRIPE_PRICE_INATA_FOUNDER=
STRIPE_PRICE_MENTORA_FOUNDER=

# ─── Resend ───
RESEND_API_KEY=
RESEND_FROM_EMAIL=oi@vozinata.com

# ─── App ───
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Voz Inata"
CRON_SECRET=                         # protege as rotas /api/cron/*

# ─── Provedor de vídeo (MVP usa Vimeo embed) ───
NEXT_PUBLIC_VIMEO_DEFAULT_QUALITY=720p

# ─── Analytics (V1.5) ───
NEXT_PUBLIC_POSTHOG_KEY=
SENTRY_DSN=
```

---

## 8 — Decisões e Trade-offs

| Decisão | Adotada | Alternativa rejeitada | Motivo |
|---|---|---|---|
| Framework | Next.js 14 App Router | Remix, Astro, Nuxt | Maior comunidade BR, deploy Vercel sem fricção |
| BaaS | Supabase | Firebase, AppWrite | Postgres real + RLS; Firebase prende dados |
| Pagamento | Stripe (com abstração) | Asaas (recomendado para Pix recorrente) | Decisão do usuário; abstração permite trocar |
| Player de vídeo | Vimeo embed no MVP | Mux/Cloudflare Stream | Custo zero no MVP; Mux entra na V2 |
| Realtime | Supabase Realtime só para notificações | Pusher, Ably | Já incluído no Supabase |
| Componentes UI | shadcn/ui copy-paste | MUI, Chakra | Total controle visual, zero peso de pacote |
| Server logic | Server Actions + API Routes mistas | tRPC, GraphQL | Stack padrão Next.js 14, menos camadas |
| Form lib | react-hook-form + zod | Formik, react-final-form | Performance e DX superiores |
| Validação | Zod no client + server | Yup, Joi | Type inference automático |
| Realtime do mural | Polling 10s para comentários | Realtime full | Reduz custo Supabase no MVP |
| Storage de fotos | Supabase Storage | Cloudflare R2 | Integrado, RLS direto; troca-se depois se necessário |
| Cron | Vercel Cron | Supabase Edge Functions | Mais simples; Vercel Cron está incluso |
| Logs | Vercel Logs + Sentry | Datadog, Logflare | Custo zero no MVP |
| Testes | Vitest + Playwright (V1.5) | Jest + Cypress | Vitest mais rápido; Playwright moderno |

---

## 9 — Capacidade e Custos Estimados

Para o **cenário realista da Skill 03** (1.090 assinantes no mês 12):

| Serviço | Tier necessário no mês 12 | Custo estimado/mês |
|---|---|---|
| Vercel | Pro | US$ 20 (~R$ 110) |
| Supabase | Pro | US$ 25 (~R$ 140) |
| Stripe | pay-as-you-go (≈ 3,99% + R$ 0,39 por transação cartão; ~0,99% Pix) | ~R$ 4.000 em taxas (sobre R$ 100k de MRR) |
| Resend | Pro | US$ 20 (~R$ 110) |
| Vimeo | Plus | US$ 12 (~R$ 65) |
| Sentry | Team | US$ 26 (~R$ 145) |
| Domínio + e-mail (Google Workspace) | — | R$ 50 |
| **Total fixo** (sem taxas Stripe) | | **~R$ 620/mês** |

Excelente margem para o MRR projetado. Vercel + Supabase podem rodar em free tier nos primeiros 2–3 meses.

---

## 10 — Roadmap Técnico (resumido)

| Fase | Semanas | Marcos técnicos |
|---|---|---|
| **Setup** | 1 | Repo criado, CI verde, deploy preview funcionando, Supabase configurado, paleta Tailwind, primeiros componentes shadcn |
| **Auth + Pagamento** | 2–3 | Login/cadastro, integração Stripe, webhook funcionando, RLS básico |
| **Mural + Biblioteca** | 4–6 | CRUD de posts (11 tipos), upload de imagem, biblioteca de conteúdo, gating por plano |
| **Agenda + Catálogo** | 7–8 | RSVP em eventos, catálogo grid + perfil individual, filtros, destaque rotativo |
| **Onboarding + E-mails** | 9 | Tour de 5 telas, templates Resend, cron de gatilhos anti-churn |
| **Admin** | 10 | Painel admin com CRUD essencial + métricas |
| **Polimento + acessibilidade** | 11 | Testes Lighthouse, WCAG audit, performance, microcopy (Skill 05) |
| **Soft launch** | 12 | 50 mulheres convidadas, captura de bugs |

---

## 11 — Handoff

```
=== HANDOFF ARQUITETURA → SKILL 08 (Banco de Dados) ===

STACK: Next.js 14 + TypeScript + Tailwind + shadcn/ui + Supabase + Stripe + Resend + Vercel

BANCO: Supabase (PostgreSQL 15) com RLS obrigatório

ENTIDADES IDENTIFICADAS (Skill 08 vai modelar):
  • profiles (estende auth.users) — bio, cidade, role, plano corrente
  • subscriptions — plano, status, founder_offer, paused_until, stripe_subscription_id
  • subscription_events — histórico de upgrades, downgrades, pausas
  • posts — 11 tipos, plano-mínimo, status, fixo (post-âncora)
  • comments — em posts
  • reactions — curtidas
  • content_items — vídeos e PDFs da biblioteca
  • content_progress — marcações de assistido
  • events — Quinta do Palco, Live de Abertura, etc.
  • event_rsvps — inscrições
  • event_recordings — gravações armazenadas
  • businesses — perfil de negócio (1:1 com profile, Inata+)
  • business_contacts — registros de clique no contato (métrica catálogo)
  • featured_businesses — destaques rotativos
  • badges — 5 selos + sistema de atribuição
  • notifications — fila in-app
  • notification_preferences — granular por canal/categoria
  • coupons — Oferta Fundadora e cupons gerais
  • partners_b2b — Marca Aliada (CRM B2B)
  • webhook_events — idempotência
  • admin_logs — trilha de auditoria
  • reports — denúncias do mural
  • announcements — comunicados admin

RLS A PROJETAR:
  • Cada usuária só vê dados próprios + dados públicos da comunidade
  • Admin tem bypass via service-role (cron e admin pages)
  • Gating de tipos de post no INSERT
  • Limite de Divulgação (2/semana) via trigger
  • Catálogo visível por todos os assinantes; perfil completo só de Inata+

ÍNDICES MÍNIMOS NECESSÁRIOS:
  • posts (created_at DESC, type, author_id)
  • events (start_at)
  • businesses (category, city, is_featured)
  • notifications (user_id, read_at)
  • subscription_events (subscription_id, created_at)

PRÓXIMA SKILL: Skill 08 — Especialista em Banco de Dados
```

---

*Documento concluído pela Skill 07 — Arquiteto de Software.*
*Consistência verificada com Skills 01, 02, 03 e 04: stack cabe no budget R$ 10k–30k e prazo 12 semanas; abstração de gateway de pagamento preserva opção de migrar para Asaas/Pagar.me se Pix recorrente exigir; toda a estrutura de pastas atende às 29 rotas mapeadas e aos 11 tipos de post + 5 selos + 6 rituais.*

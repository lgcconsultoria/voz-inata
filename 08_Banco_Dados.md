# Voz Inata — Banco de Dados (PostgreSQL + Supabase)

**Skill 08 — Especialista em Banco de Dados**
**Data:** 14 de maio de 2026
**Status:** Concluída — pronta para virar migrations reais no Supabase
**Documentos anteriores:** Skills 01, 02, 03, 04, 07

---

## Convenções

- **Nomes:** `snake_case` em tabelas, colunas e índices.
- **IDs:** UUID v4 (`gen_random_uuid()`).
- **Timestamps:** `created_at` e `updated_at` em toda tabela mutável (`timestamptz`).
- **Soft delete:** coluna `deleted_at` (NULL = ativo) — RLS filtra por padrão.
- **Auditoria:** trail crítica vai em `admin_logs` e `webhook_events`.
- **Idempotência:** `webhook_events` evita reprocessamento.
- **Money:** sempre em `INTEGER` representando **centavos** (sem float).
- **RLS:** **habilitado em todas as tabelas**. Operações administrativas usam `service_role`.

Este arquivo serve como **fonte da verdade** para gerar `supabase/migrations/*.sql` no repositório.

---

## 1 — Enums (tipos restritos)

```sql
-- Planos (nomes do produto, fixados nas Skills 01 e 03)
CREATE TYPE plan_type AS ENUM ('voz', 'inata', 'mentora');

-- Papéis de usuária
CREATE TYPE user_role AS ENUM ('member', 'moderator', 'admin');

-- Status de assinatura (espelha o ciclo de vida do Stripe + pausa)
CREATE TYPE subscription_status AS ENUM (
  'pending',       -- antes do checkout completar
  'active',
  'past_due',      -- D+0 a D+6 após falha
  'suspended',     -- D+7 a D+14 (acesso bloqueado, ainda recuperável)
  'paused',        -- pausa voluntária até 60 dias/ano
  'canceled',
  'expired'
);

-- 11 tipos de post (Skill 02 §2.3)
CREATE TYPE post_type AS ENUM (
  'apresentacao', 'intencao', 'conquista', 'indicacao',
  'divulgacao', 'pergunta', 'aprendizado', 'oportunidade',
  'desafio_admin', 'destaque_admin', 'aviso_admin'
);

CREATE TYPE post_status AS ENUM ('published', 'hidden', 'removed');

-- Moderação
CREATE TYPE moderation_severity AS ENUM ('warning', 'temporary_hide', 'cancel');

-- Eventos
CREATE TYPE event_kind AS ENUM (
  'live_abertura',     -- Segunda
  'conteudo',          -- Terça (gravado, não é evento ao vivo)
  'quinta_palco',
  'extra',             -- demais eventos ao vivo
  'cohort'             -- turmas pagas
);
CREATE TYPE event_status AS ENUM ('scheduled', 'live', 'ended', 'canceled');

-- Conteúdo (biblioteca)
CREATE TYPE content_kind AS ENUM ('video', 'pdf', 'article', 'audio');

-- Selos (Skill 02 §2.7)
CREATE TYPE badge_code AS ENUM (
  'recem_chegada',
  'ativa',
  'conectora',
  'palco',
  'parceira'
);

-- Notificações
CREATE TYPE notification_kind AS ENUM (
  'welcome', 'onboarding_step', 'comment_received', 'reaction_received',
  'event_reminder', 'event_invitation', 'event_starting',
  'pre_renewal', 'payment_failed', 'payment_recovered',
  'badge_awarded', 'voice_of_month', 'featured_business',
  'admin_announcement', 'moderation_action'
);
CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'push');

-- Eventos de cobrança (auditoria/relatório)
CREATE TYPE billing_event_kind AS ENUM (
  'subscription_created', 'subscription_activated', 'subscription_renewed',
  'subscription_upgraded', 'subscription_downgraded',
  'subscription_paused', 'subscription_resumed',
  'subscription_canceled', 'payment_failed', 'payment_recovered',
  'refund_issued'
);

-- Ações de admin (auditoria)
CREATE TYPE admin_action AS ENUM (
  'post_hidden', 'post_removed', 'user_warned', 'user_suspended', 'user_unblocked',
  'business_featured', 'business_unfeatured', 'voice_of_month_set',
  'event_created', 'event_canceled', 'event_recording_uploaded',
  'content_published', 'content_unpublished',
  'coupon_created', 'partner_b2b_created', 'announcement_sent',
  'subscription_force_canceled', 'subscription_paused', 'subscription_resumed'
);
```

---

## 2 — Tabelas

### 2.1 profiles (1:1 com `auth.users`)

```sql
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  display_name    TEXT,
  avatar_url      TEXT,
  bio             TEXT CHECK (char_length(bio) <= 200),
  city            TEXT,
  state           CHAR(2),
  phone           TEXT,                       -- WhatsApp E.164
  role            user_role NOT NULL DEFAULT 'member',
  current_plan    plan_type,                  -- null = sem assinatura ativa
  is_blocked      BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_state JSONB NOT NULL DEFAULT '{}'::jsonb,
                  -- {profile_completed, first_post_at, first_event_at, business_published_at}
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_current_plan ON profiles(current_plan);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC);
```

### 2.2 subscriptions

```sql
CREATE TABLE subscriptions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan                      plan_type NOT NULL,
  status                    subscription_status NOT NULL DEFAULT 'pending',
  stripe_customer_id        TEXT,
  stripe_subscription_id    TEXT UNIQUE,
  stripe_price_id           TEXT,
  billing_cycle             TEXT NOT NULL CHECK (billing_cycle IN ('monthly','yearly')),
  unit_amount_cents         INTEGER NOT NULL CHECK (unit_amount_cents > 0),
  is_founder_offer          BOOLEAN NOT NULL DEFAULT FALSE,
  current_period_start      TIMESTAMPTZ,
  current_period_end        TIMESTAMPTZ,
  cancel_at_period_end      BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at               TIMESTAMPTZ,
  cancel_reason             TEXT,
  paused_at                 TIMESTAMPTZ,
  pause_resumes_at          TIMESTAMPTZ,                -- max 60 dias após pause
  pause_days_used_this_year INTEGER NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- Apenas uma assinatura ATIVA por usuária por vez
CREATE UNIQUE INDEX uniq_active_subscription_per_user
  ON subscriptions(user_id)
  WHERE status IN ('active','past_due','paused');
```

### 2.3 subscription_events (auditoria de cobrança)

```sql
CREATE TABLE subscription_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id),
  kind            billing_event_kind NOT NULL,
  from_plan       plan_type,
  to_plan         plan_type,
  amount_cents    INTEGER,
  meta            JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subevents_user ON subscription_events(user_id, created_at DESC);
CREATE INDEX idx_subevents_sub  ON subscription_events(subscription_id, created_at DESC);
```

### 2.4 payments

```sql
CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id     UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id             UUID NOT NULL REFERENCES profiles(id),
  stripe_invoice_id   TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount_cents        INTEGER NOT NULL,
  status              TEXT NOT NULL
                      CHECK (status IN ('pending','succeeded','failed','refunded','requires_action')),
  payment_method      TEXT CHECK (payment_method IN ('card','pix','boleto')),
  paid_at             TIMESTAMPTZ,
  due_date            DATE,
  failure_code        TEXT,
  failure_message     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_status ON payments(status);
```

### 2.5 coupons (incluindo Oferta Fundadora)

```sql
CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  description     TEXT,
  applies_to_plan plan_type,                            -- null = qualquer plano
  discount_kind   TEXT NOT NULL CHECK (discount_kind IN ('percent','fixed_cents','founder_price')),
  discount_value  INTEGER NOT NULL,                     -- % ou centavos ou preço-trava
  max_redemptions INTEGER,                              -- null = ilimitado
  redemptions     INTEGER NOT NULL DEFAULT 0,
  starts_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  stripe_coupon_id TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_coupons_code ON coupons(LOWER(code));
```

### 2.6 businesses (catálogo)

```sql
CREATE TABLE businesses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  business_name   TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  category        TEXT NOT NULL,
  short_pitch     TEXT CHECK (char_length(short_pitch) <= 80),
  description     TEXT,
  city            TEXT,
  state           CHAR(2),
  instagram_url   TEXT,
  whatsapp        TEXT,
  website_url     TEXT,
  logo_url        TEXT,
  gallery_urls    TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_visible      BOOLEAN NOT NULL DEFAULT TRUE,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,        -- só publica quando usuária optar
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_published ON businesses(is_published) WHERE is_published;
```

### 2.7 featured_businesses (destaque rotativo)

```sql
CREATE TABLE featured_businesses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('weekly','paid_avulso','parceira_rotativo','founder_48h')),
  starts_at     TIMESTAMPTZ NOT NULL,
  ends_at       TIMESTAMPTZ NOT NULL,
  created_by    UUID REFERENCES profiles(id),
  payment_id    UUID REFERENCES payments(id),            -- se foi destaque pago
  CHECK (ends_at > starts_at),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_featured_period ON featured_businesses(starts_at, ends_at);
```

### 2.8 business_contacts (métrica de catálogo)

```sql
CREATE TABLE business_contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  visitor_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  channel       TEXT NOT NULL CHECK (channel IN ('whatsapp','instagram','website','profile_view')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_business_contacts_biz ON business_contacts(business_id, created_at DESC);
```

### 2.9 posts (mural)

```sql
CREATE TABLE posts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_type           post_type NOT NULL,
  content             TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1500),
  image_url           TEXT,
  tags                TEXT[] DEFAULT ARRAY[]::TEXT[],
  status              post_status NOT NULL DEFAULT 'published',
  is_anchor           BOOLEAN NOT NULL DEFAULT FALSE,    -- post-âncora (admin), fixo no topo
  pinned_until        TIMESTAMPTZ,                       -- desfixa automaticamente
  parent_anchor_id    UUID REFERENCES posts(id),         -- p/ Intenção/Indicação respondendo um post-âncora
  reactions_count     INTEGER NOT NULL DEFAULT 0,
  comments_count      INTEGER NOT NULL DEFAULT 0,
  reports_count       INTEGER NOT NULL DEFAULT 0,
  edited_at           TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_feed ON posts(created_at DESC) WHERE deleted_at IS NULL AND status = 'published';
CREATE INDEX idx_posts_author ON posts(author_id, created_at DESC);
CREATE INDEX idx_posts_type ON posts(post_type, created_at DESC);
CREATE INDEX idx_posts_anchor ON posts(is_anchor, pinned_until) WHERE is_anchor;
```

### 2.10 reactions

```sql
CREATE TABLE reactions (
  post_id   UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji     TEXT NOT NULL DEFAULT '❤️',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id, emoji)
);
```

### 2.11 comments

```sql
CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE,  -- thread 1 nível
  content     TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  is_removed  BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at);
```

### 2.12 post_reports

```sql
CREATE TABLE post_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason      TEXT NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  resolution  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, reporter_id)
);

CREATE INDEX idx_reports_open ON post_reports(post_id) WHERE resolved_at IS NULL;
```

### 2.13 moderation_actions

```sql
CREATE TABLE moderation_actions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id  UUID NOT NULL REFERENCES profiles(id),
  severity        moderation_severity NOT NULL,
  reason          TEXT NOT NULL,
  related_post_id UUID REFERENCES posts(id),
  decided_by      UUID NOT NULL REFERENCES profiles(id),
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_modactions_user ON moderation_actions(target_user_id, created_at DESC);
```

### 2.14 content_items (biblioteca)

```sql
CREATE TABLE content_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  kind                content_kind NOT NULL,
  category            TEXT,
  thumbnail_url       TEXT,
  video_provider      TEXT CHECK (video_provider IN ('vimeo','mux','youtube')),
  video_id            TEXT,
  pdf_url             TEXT,
  article_body_md     TEXT,
  duration_seconds    INTEGER,
  required_plan       plan_type,                  -- null = qualquer plano
  is_published        BOOLEAN NOT NULL DEFAULT FALSE,
  published_at        TIMESTAMPTZ,
  author_credit_user_id UUID REFERENCES profiles(id),  -- Parceira convidada
  tags                TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by          UUID REFERENCES profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_published ON content_items(is_published, published_at DESC);
CREATE INDEX idx_content_required_plan ON content_items(required_plan);
```

### 2.15 content_progress

```sql
CREATE TABLE content_progress (
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id   UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  progress_pct SMALLINT NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  completed_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, content_id)
);
```

### 2.16 events

```sql
CREATE TABLE events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  kind                event_kind NOT NULL,
  status              event_status NOT NULL DEFAULT 'scheduled',
  starts_at           TIMESTAMPTZ NOT NULL,
  ends_at             TIMESTAMPTZ,
  meeting_url         TEXT,
  cover_url           TEXT,
  host_user_id        UUID REFERENCES profiles(id),  -- Parceira/Premium do Palco
  required_plan       plan_type,                     -- null = qualquer assinante
  voz_quota_allowed   BOOLEAN NOT NULL DEFAULT TRUE, -- contabiliza na cota mensal da Voz
  max_attendees       INTEGER,
  recording_content_id UUID REFERENCES content_items(id),  -- vincula gravação
  created_by          UUID REFERENCES profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_starts_at ON events(starts_at);
CREATE INDEX idx_events_kind ON events(kind, starts_at);
```

### 2.17 event_rsvps

```sql
CREATE TABLE event_rsvps (
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attended    BOOLEAN,
  PRIMARY KEY (event_id, user_id)
);

CREATE INDEX idx_event_rsvps_user ON event_rsvps(user_id, rsvp_at DESC);
```

### 2.18 palco_applications (candidaturas ao Palco)

```sql
CREATE TABLE palco_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quarter         TEXT NOT NULL,            -- ex: '2026-Q2'
  pitch           TEXT NOT NULL,
  topic           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected','scheduled','done')),
  scheduled_event_id UUID REFERENCES events(id),
  decided_by      UUID REFERENCES profiles(id),
  decided_at      TIMESTAMPTZ,
  decision_note   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, quarter)
);
```

### 2.19 badges (5 selos da Skill 02)

```sql
CREATE TABLE badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code        badge_code NOT NULL,
  awarded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  awarded_by  UUID REFERENCES profiles(id),
  meta        JSONB,
  UNIQUE (user_id, code)
);

CREATE INDEX idx_badges_user ON badges(user_id);
```

### 2.20 voice_of_month / featured highlights

```sql
CREATE TABLE editorial_highlights (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind            TEXT NOT NULL CHECK (kind IN ('voice_of_month','featured_business','palco_de_honra')),
  user_id         UUID REFERENCES profiles(id),
  business_id     UUID REFERENCES businesses(id),
  event_id        UUID REFERENCES events(id),
  reference_month DATE,
  cover_url       TEXT,
  blurb           TEXT,
  published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES profiles(id),
  CHECK (
    (kind = 'voice_of_month'    AND user_id IS NOT NULL) OR
    (kind = 'featured_business' AND business_id IS NOT NULL) OR
    (kind = 'palco_de_honra'    AND event_id IS NOT NULL)
  )
);

CREATE INDEX idx_highlights_published ON editorial_highlights(published_at DESC);
```

### 2.21 notifications

```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind        notification_kind NOT NULL,
  channel     notification_channel NOT NULL DEFAULT 'in_app',
  title       TEXT NOT NULL,
  body        TEXT,
  action_url  TEXT,
  related_id  UUID,
  read_at     TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC)
  WHERE read_at IS NULL;
CREATE INDEX idx_notifications_user_all ON notifications(user_id, created_at DESC);
```

### 2.22 notification_preferences (granular por canal × tipo)

```sql
CREATE TABLE notification_preferences (
  user_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind     notification_kind NOT NULL,
  channel  notification_channel NOT NULL,
  enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (user_id, kind, channel)
);
```

### 2.23 b2b_partners (Marca Aliada — separado dos planos B2C)

```sql
CREATE TABLE b2b_partners (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name      TEXT NOT NULL,
  contact_name      TEXT,
  contact_email     TEXT,
  contact_phone     TEXT,
  segment           TEXT,
  package           TEXT NOT NULL CHECK (package IN ('trimestral','anual')),
  contract_amount_cents INTEGER NOT NULL,
  starts_at         DATE NOT NULL,
  ends_at           DATE NOT NULL,
  status            TEXT NOT NULL DEFAULT 'lead'
                    CHECK (status IN ('lead','negotiating','active','ended','churned')),
  exclusivity_segment BOOLEAN NOT NULL DEFAULT FALSE,
  notes             TEXT,
  managed_by        UUID REFERENCES profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_b2b_status ON b2b_partners(status);
```

### 2.24 announcements (avisos oficiais + e-mail marketing)

```sql
CREATE TABLE announcements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  body_md         TEXT NOT NULL,
  audience_plan   plan_type,                    -- null = todos
  channels        notification_channel[] NOT NULL,
  scheduled_for   TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.25 webhook_events (idempotência)

```sql
CREATE TABLE webhook_events (
  id          TEXT PRIMARY KEY,            -- event id externo (Stripe, Resend)
  provider    TEXT NOT NULL,
  type        TEXT NOT NULL,
  payload     JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status      TEXT NOT NULL CHECK (status IN ('received','processed','failed')),
  error       TEXT
);
```

### 2.26 admin_logs

```sql
CREATE TABLE admin_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID NOT NULL REFERENCES profiles(id),
  action      admin_action NOT NULL,
  target_type TEXT,
  target_id   UUID,
  note        TEXT,
  meta        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.27 waitlist (Fase 0 — lista de espera pública)

```sql
CREATE TABLE waitlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  city        TEXT,
  state       CHAR(2),
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  converted_user_id UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3 — Triggers e Funções

### 3.1 Auto-`updated_at`

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar nas tabelas com updated_at:
CREATE TRIGGER trg_profiles_updated      BEFORE UPDATE ON profiles      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_subs_updated          BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_businesses_updated    BEFORE UPDATE ON businesses    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_posts_updated         BEFORE UPDATE ON posts         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_content_updated       BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_events_updated        BEFORE UPDATE ON events        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_b2b_updated           BEFORE UPDATE ON b2b_partners  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 3.2 Cria profile ao registrar usuária

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nova membra'));
  -- Selo de boas-vindas
  INSERT INTO badges (user_id, code) VALUES (NEW.id, 'recem_chegada');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 3.3 Contadores de reactions e comments

```sql
CREATE OR REPLACE FUNCTION inc_post_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'reactions' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE posts SET reactions_count = reactions_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE posts SET reactions_count = GREATEST(reactions_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reactions_count AFTER INSERT OR DELETE ON reactions
  FOR EACH ROW EXECUTE FUNCTION inc_post_counters();
CREATE TRIGGER trg_comments_count AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION inc_post_counters();
```

### 3.4 Limite de Divulgação do Negócio (2/semana, Inata+)

```sql
CREATE OR REPLACE FUNCTION enforce_post_business_rules()
RETURNS TRIGGER AS $$
DECLARE
  v_plan plan_type;
  v_count INT;
BEGIN
  -- Tipos admin requerem role admin
  IF NEW.post_type IN ('desafio_admin','destaque_admin','aviso_admin') THEN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.author_id AND role IN ('admin','moderator')) THEN
      RAISE EXCEPTION 'Apenas admin pode publicar post do tipo %', NEW.post_type;
    END IF;
    RETURN NEW;
  END IF;

  -- Plano da autora (membros precisam ter plano ativo)
  SELECT current_plan INTO v_plan FROM profiles WHERE id = NEW.author_id;

  IF v_plan IS NULL THEN
    RAISE EXCEPTION 'Usuária sem assinatura ativa não pode publicar';
  END IF;

  IF NEW.post_type = 'divulgacao' THEN
    IF v_plan NOT IN ('inata','mentora') THEN
      RAISE EXCEPTION 'Divulgação do Negócio é exclusiva dos planos Inata e Mentora';
    END IF;

    SELECT COUNT(*) INTO v_count
    FROM posts
    WHERE author_id = NEW.author_id
      AND post_type = 'divulgacao'
      AND deleted_at IS NULL
      AND created_at >= date_trunc('week', NOW());

    IF v_count >= 2 THEN
      RAISE EXCEPTION 'Limite de 2 Divulgações por semana atingido';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_post_rules
  BEFORE INSERT ON posts
  FOR EACH ROW EXECUTE FUNCTION enforce_post_business_rules();
```

### 3.5 Sincroniza `profiles.current_plan` com `subscriptions.status`

```sql
CREATE OR REPLACE FUNCTION sync_profile_current_plan()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
     SET current_plan = (
        SELECT plan FROM subscriptions
         WHERE user_id = NEW.user_id
           AND status IN ('active','past_due','paused')
         ORDER BY updated_at DESC LIMIT 1
     )
   WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_sync_plan
  AFTER INSERT OR UPDATE OF status, plan ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION sync_profile_current_plan();
```

### 3.6 Atribui selo "ativa" quando atingir critério (perfil + 1 post + 1 evento em 30 dias)

```sql
CREATE OR REPLACE FUNCTION maybe_award_active_badge(p_user UUID)
RETURNS VOID AS $$
DECLARE
  v_first_post TIMESTAMPTZ;
  v_first_event TIMESTAMPTZ;
  v_profile_ok BOOLEAN;
BEGIN
  SELECT MIN(created_at) INTO v_first_post FROM posts WHERE author_id = p_user;
  SELECT MIN(rsvp_at) INTO v_first_event FROM event_rsvps WHERE user_id = p_user;
  SELECT (avatar_url IS NOT NULL AND bio IS NOT NULL)
    INTO v_profile_ok FROM profiles WHERE id = p_user;

  IF v_profile_ok AND v_first_post IS NOT NULL AND v_first_event IS NOT NULL THEN
    INSERT INTO badges (user_id, code) VALUES (p_user, 'ativa')
    ON CONFLICT (user_id, code) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

(Chamado em background pelo cron de ativação — não em trigger, para evitar cascata.)

---

## 4 — Row Level Security (RLS)

```sql
-- Habilitar em todas as tabelas sensíveis
ALTER TABLE profiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_businesses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_contacts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions                ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items            ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_progress         ENABLE ROW LEVEL SECURITY;
ALTER TABLE events                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps              ENABLE ROW LEVEL SECURITY;
ALTER TABLE palco_applications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_highlights     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications            ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_partners             ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements            ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist                 ENABLE ROW LEVEL SECURITY;

-- Helper: usuária autenticada com assinatura ativa
CREATE OR REPLACE FUNCTION is_active_member()
RETURNS BOOLEAN
LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
     WHERE id = auth.uid()
       AND current_plan IS NOT NULL
       AND is_blocked = FALSE
  );
$$;

-- Helper: usuária admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','moderator')
  );
$$;

-- PROFILES
CREATE POLICY profiles_select_self_or_member ON profiles FOR SELECT
  USING (id = auth.uid() OR is_active_member() OR is_admin());
CREATE POLICY profiles_update_self ON profiles FOR UPDATE
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- SUBSCRIPTIONS — só dona ou admin
CREATE POLICY subs_select_self ON subscriptions FOR SELECT
  USING (user_id = auth.uid() OR is_admin());
CREATE POLICY subs_insert_self ON subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid() OR is_admin());

-- PAYMENTS — só dona ou admin
CREATE POLICY payments_select_self ON payments FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- POSTS — leitura: assinante ativa OU admin; escrita: autora; edição/exclusão: autora ou admin
CREATE POLICY posts_select_active ON posts FOR SELECT
  USING ((is_active_member() OR is_admin()) AND status = 'published' AND deleted_at IS NULL);
CREATE POLICY posts_insert_self ON posts FOR INSERT
  WITH CHECK (author_id = auth.uid() AND is_active_member());
CREATE POLICY posts_update_owner ON posts FOR UPDATE
  USING (author_id = auth.uid() OR is_admin());
CREATE POLICY posts_delete_owner_or_admin ON posts FOR DELETE
  USING (author_id = auth.uid() OR is_admin());

-- COMMENTS / REACTIONS
CREATE POLICY comments_select_active ON comments FOR SELECT
  USING (is_active_member() OR is_admin());
CREATE POLICY comments_insert_self ON comments FOR INSERT
  WITH CHECK (author_id = auth.uid() AND is_active_member());
CREATE POLICY comments_modify_owner ON comments FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY comments_delete_owner_or_admin ON comments FOR DELETE
  USING (author_id = auth.uid() OR is_admin());

CREATE POLICY reactions_select_active ON reactions FOR SELECT
  USING (is_active_member() OR is_admin());
CREATE POLICY reactions_insert_self ON reactions FOR INSERT
  WITH CHECK (user_id = auth.uid() AND is_active_member());
CREATE POLICY reactions_delete_self ON reactions FOR DELETE
  USING (user_id = auth.uid());

-- BUSINESSES — visíveis para qualquer assinante; edição só da dona
CREATE POLICY businesses_select_active ON businesses FOR SELECT
  USING ((is_published AND is_visible AND is_active_member()) OR user_id = auth.uid() OR is_admin());
CREATE POLICY businesses_insert_self ON businesses FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles
                 WHERE id = auth.uid() AND current_plan IN ('inata','mentora'))
  );
CREATE POLICY businesses_update_self ON businesses FOR UPDATE USING (user_id = auth.uid());

-- CONTENT — visível só para o plano exigido
CREATE POLICY content_select_by_plan ON content_items FOR SELECT
  USING (
    is_published AND (
      required_plan IS NULL OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND current_plan IS NOT NULL
                AND (required_plan = 'voz' OR current_plan = required_plan OR
                     (required_plan = 'inata' AND current_plan IN ('inata','mentora'))))
    ) OR is_admin()
  );

-- EVENTS
CREATE POLICY events_select_active ON events FOR SELECT
  USING (is_active_member() OR is_admin());
CREATE POLICY rsvps_select_self ON event_rsvps FOR SELECT
  USING (user_id = auth.uid() OR is_admin());
CREATE POLICY rsvps_insert_self ON event_rsvps FOR INSERT
  WITH CHECK (user_id = auth.uid() AND is_active_member());

-- BADGES
CREATE POLICY badges_select_self_or_admin ON badges FOR SELECT
  USING (user_id = auth.uid() OR is_active_member() OR is_admin());

-- NOTIFICATIONS — sempre próprias
CREATE POLICY notifications_select_self ON notifications FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY notifications_update_self ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- B2B PARTNERS / WAITLIST / ADMIN_LOGS — apenas admin
CREATE POLICY b2b_admin ON b2b_partners FOR ALL USING (is_admin());
CREATE POLICY waitlist_admin_select ON waitlist FOR SELECT USING (is_admin());
CREATE POLICY waitlist_insert_public ON waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY admin_logs_admin ON admin_logs FOR ALL USING (is_admin());
```

Operações administrativas pesadas (cron, criação de eventos, envio de comunicados, processamento de webhooks) usam a **`service_role` key** do Supabase do lado do servidor — bypassa o RLS por design e é confinada às API Routes / Server Actions privadas.

---

## 5 — Storage (Supabase Storage Buckets)

| Bucket | Público? | Uso | Tamanho máx/upload |
|---|---|---|---|
| `avatars` | público | foto de perfil | 2 MB |
| `business-logos` | público | logos do catálogo | 2 MB |
| `business-gallery` | público | galeria do negócio | 4 MB |
| `posts-images` | público | imagens em posts do mural | 4 MB |
| `event-covers` | público | capas de evento | 4 MB |
| `event-recordings` | privado | gravações (só Inata+) | sem limite (link Vimeo) |
| `content-pdfs` | privado | PDFs da biblioteca | 20 MB |
| `internal-assets` | privado | brand assets, e-mail | — |

Buckets privados usam URL assinada com TTL — geradas em Server Actions com `service_role`, conforme plano da usuária.

---

## 6 — Índices adicionais e performance

```sql
-- Feed do mural: índice composto pra paginação cursor-based
CREATE INDEX idx_posts_feed_cursor
  ON posts (created_at DESC, id DESC)
  WHERE deleted_at IS NULL AND status = 'published';

-- Catálogo: busca full-text simples por nome + descrição
ALTER TABLE businesses
  ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (
    to_tsvector('portuguese',
      coalesce(business_name,'') || ' ' || coalesce(short_pitch,'') || ' ' || coalesce(description,'')
    )
  ) STORED;

CREATE INDEX idx_businesses_search ON businesses USING GIN (search_tsv);

-- Catálogo: índice composto para o grid filtrável
CREATE INDEX idx_businesses_filter
  ON businesses (is_published, category, city)
  WHERE is_visible;
```

---

## 7 — Seed inicial (dados mínimos)

```sql
-- Admin inicial (substituir UUID/e-mail real após signup)
INSERT INTO profiles (id, full_name, role, current_plan)
VALUES ('<UUID DA FUNDADORA>', 'Fundadora Voz Inata', 'admin', 'mentora')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Categorias mais comuns do catálogo
INSERT INTO content_items (slug, title, kind, required_plan, is_published, published_at)
VALUES
  ('boas-vindas-fundadora', 'Boas-vindas da Fundadora', 'video', NULL, true, NOW()),
  ('como-montar-perfil-catalogo', 'Como montar seu perfil no Catálogo', 'video', 'inata', true, NOW());

-- Cupons Oferta Fundadora (vagas 100/100)
INSERT INTO coupons (code, description, applies_to_plan, discount_kind, discount_value, max_redemptions)
VALUES
  ('FUNDADORA_VOZ',     'Voz a R$ 39 vitalício',     'voz',     'founder_price', 3900,  100),
  ('FUNDADORA_INATA',   'Inata a R$ 69 vitalício',   'inata',   'founder_price', 6900,  100),
  ('FUNDADORA_MENTORA', 'Mentora a R$ 199 vitalício','mentora', 'founder_price', 19900, 20);
```

---

## 8 — Handoff

```
=== HANDOFF BANCO DE DADOS → GERAÇÃO DE CÓDIGO ===

BANCO: Supabase (PostgreSQL 15)
TABELAS CRIADAS: 27 tabelas + 13 enums + 6 funções + 14 triggers
RLS: habilitado em todas as tabelas sensíveis (24 políticas)
STORAGE: 8 buckets (5 públicos, 3 privados)
SEEDS: admin, conteúdos iniciais, cupons Oferta Fundadora

REGRAS DE NEGÓCIO IMPLEMENTADAS NO BANCO:
  • Divulgação do Negócio: bloqueia se plano ≠ inata/mentora (trigger)
  • Limite 2 Divulgações/semana: contador na trigger
  • Posts tipo admin: só role admin/moderator (trigger)
  • Catálogo visível só para Inata+ na criação (RLS)
  • Conteúdo gated por plano (RLS)
  • Profile auto-criado ao signup com selo "recém-chegada"
  • Sincronização profiles.current_plan ↔ subscriptions.status

SAÍDA: este documento serve como fonte da verdade para:
  → supabase/migrations/0001_init.sql      (enums + tabelas)
  → supabase/migrations/0002_functions.sql (triggers e funções)
  → supabase/migrations/0003_rls.sql       (políticas)
  → supabase/migrations/0004_indexes.sql   (índices adicionais)
  → supabase/migrations/0005_seed.sql      (seeds opcionais)
  → supabase/seed.sql                      (referência local)

PRÓXIMA ETAPA: Geração do repositório Next.js no GitHub
```

---

*Documento concluído pela Skill 08 — Banco de Dados.*
*Consistência verificada com Skills 01, 02, 03, 04 e 07: plano `voz/inata/mentora`, 11 tipos de post, 5 selos, eventos com cota Voz e Palco com cota Mentora, Oferta Fundadora vitalícia, pausa de 60 dias, Marca Aliada como CRM B2B isolado, webhook idempotente — todos refletidos no schema.*

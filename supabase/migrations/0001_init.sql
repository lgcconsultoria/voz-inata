-- 0001_init.sql — Enums e tabelas core
-- Fonte: 08_Banco_Dados.md (Skill 08)
-- Aplicar com `supabase db push` ou via SQL Editor no painel do Supabase.

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

CREATE TYPE plan_type AS ENUM ('voz', 'inata', 'mentora');

CREATE TYPE user_role AS ENUM ('member', 'moderator', 'admin');

CREATE TYPE subscription_status AS ENUM (
  'pending', 'active', 'past_due', 'suspended',
  'paused', 'canceled', 'expired'
);

CREATE TYPE post_type AS ENUM (
  'apresentacao', 'intencao', 'conquista', 'indicacao',
  'divulgacao', 'pergunta', 'aprendizado', 'oportunidade',
  'desafio_admin', 'destaque_admin', 'aviso_admin'
);

CREATE TYPE post_status AS ENUM ('published', 'hidden', 'removed');

CREATE TYPE moderation_severity AS ENUM ('warning', 'temporary_hide', 'cancel');

CREATE TYPE event_kind AS ENUM (
  'live_abertura', 'conteudo', 'quinta_palco', 'extra', 'cohort'
);

CREATE TYPE event_status AS ENUM ('scheduled', 'live', 'ended', 'canceled');

CREATE TYPE content_kind AS ENUM ('video', 'pdf', 'article', 'audio');

CREATE TYPE badge_code AS ENUM (
  'recem_chegada', 'ativa', 'conectora', 'palco', 'parceira'
);

CREATE TYPE notification_kind AS ENUM (
  'welcome', 'onboarding_step', 'comment_received', 'reaction_received',
  'event_reminder', 'event_invitation', 'event_starting',
  'pre_renewal', 'payment_failed', 'payment_recovered',
  'badge_awarded', 'voice_of_month', 'featured_business',
  'admin_announcement', 'moderation_action'
);

CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'push');

CREATE TYPE billing_event_kind AS ENUM (
  'subscription_created', 'subscription_activated', 'subscription_renewed',
  'subscription_upgraded', 'subscription_downgraded',
  'subscription_paused', 'subscription_resumed',
  'subscription_canceled', 'payment_failed', 'payment_recovered',
  'refund_issued'
);

CREATE TYPE admin_action AS ENUM (
  'post_hidden', 'post_removed', 'user_warned', 'user_suspended', 'user_unblocked',
  'business_featured', 'business_unfeatured', 'voice_of_month_set',
  'event_created', 'event_canceled', 'event_recording_uploaded',
  'content_published', 'content_unpublished',
  'coupon_created', 'partner_b2b_created', 'announcement_sent',
  'subscription_force_canceled', 'subscription_paused', 'subscription_resumed'
);

-- ============================================================================
-- 2. TABELAS — IDENTIDADE / ASSINATURA
-- ============================================================================

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  display_name    TEXT,
  avatar_url      TEXT,
  bio             TEXT CHECK (char_length(bio) <= 200),
  city            TEXT,
  state           CHAR(2),
  phone           TEXT,
  role            user_role NOT NULL DEFAULT 'member',
  current_plan    plan_type,
  is_blocked      BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_current_plan ON profiles(current_plan);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC);

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
  pause_resumes_at          TIMESTAMPTZ,
  pause_days_used_this_year INTEGER NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);
CREATE UNIQUE INDEX uniq_active_subscription_per_user
  ON subscriptions(user_id)
  WHERE status IN ('active','past_due','paused');

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

CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  description     TEXT,
  applies_to_plan plan_type,
  discount_kind   TEXT NOT NULL CHECK (discount_kind IN ('percent','fixed_cents','founder_price')),
  discount_value  INTEGER NOT NULL,
  max_redemptions INTEGER,
  redemptions     INTEGER NOT NULL DEFAULT 0,
  starts_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  stripe_coupon_id TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_coupons_code ON coupons(LOWER(code));

-- ============================================================================
-- 3. TABELAS — COMUNIDADE
-- ============================================================================

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
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_published ON businesses(is_published) WHERE is_published;

CREATE TABLE featured_businesses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('weekly','paid_avulso','parceira_rotativo','founder_48h')),
  starts_at     TIMESTAMPTZ NOT NULL,
  ends_at       TIMESTAMPTZ NOT NULL,
  created_by    UUID REFERENCES profiles(id),
  payment_id    UUID REFERENCES payments(id),
  CHECK (ends_at > starts_at),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_featured_period ON featured_businesses(starts_at, ends_at);

CREATE TABLE business_contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  visitor_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  channel       TEXT NOT NULL CHECK (channel IN ('whatsapp','instagram','website','profile_view')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_business_contacts_biz ON business_contacts(business_id, created_at DESC);

CREATE TABLE posts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_type           post_type NOT NULL,
  content             TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1500),
  image_url           TEXT,
  tags                TEXT[] DEFAULT ARRAY[]::TEXT[],
  status              post_status NOT NULL DEFAULT 'published',
  is_anchor           BOOLEAN NOT NULL DEFAULT FALSE,
  pinned_until        TIMESTAMPTZ,
  parent_anchor_id    UUID REFERENCES posts(id),
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

CREATE TABLE reactions (
  post_id   UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji     TEXT NOT NULL DEFAULT '❤️',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id, emoji)
);

CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  is_removed  BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_comments_post ON comments(post_id, created_at);

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

-- ============================================================================
-- 4. TABELAS — CONTEÚDO E EVENTOS
-- ============================================================================

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
  required_plan       plan_type,
  is_published        BOOLEAN NOT NULL DEFAULT FALSE,
  published_at        TIMESTAMPTZ,
  author_credit_user_id UUID REFERENCES profiles(id),
  tags                TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by          UUID REFERENCES profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_content_published ON content_items(is_published, published_at DESC);
CREATE INDEX idx_content_required_plan ON content_items(required_plan);

CREATE TABLE content_progress (
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id   UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  progress_pct SMALLINT NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  completed_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, content_id)
);

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
  host_user_id        UUID REFERENCES profiles(id),
  required_plan       plan_type,
  voz_quota_allowed   BOOLEAN NOT NULL DEFAULT TRUE,
  max_attendees       INTEGER,
  recording_content_id UUID REFERENCES content_items(id),
  created_by          UUID REFERENCES profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_events_starts_at ON events(starts_at);
CREATE INDEX idx_events_kind ON events(kind, starts_at);

CREATE TABLE event_rsvps (
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attended    BOOLEAN,
  PRIMARY KEY (event_id, user_id)
);
CREATE INDEX idx_event_rsvps_user ON event_rsvps(user_id, rsvp_at DESC);

CREATE TABLE palco_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quarter         TEXT NOT NULL,
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

-- ============================================================================
-- 5. TABELAS — RECONHECIMENTO, NOTIFICAÇÕES E ADMIN
-- ============================================================================

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

CREATE TABLE notification_preferences (
  user_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind     notification_kind NOT NULL,
  channel  notification_channel NOT NULL,
  enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (user_id, kind, channel)
);

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

CREATE TABLE announcements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  body_md         TEXT NOT NULL,
  audience_plan   plan_type,
  channels        notification_channel[] NOT NULL,
  scheduled_for   TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_events (
  id          TEXT PRIMARY KEY,
  provider    TEXT NOT NULL,
  type        TEXT NOT NULL,
  payload     JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status      TEXT NOT NULL CHECK (status IN ('received','processed','failed')),
  error       TEXT
);

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

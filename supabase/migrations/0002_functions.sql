-- 0002_functions.sql — Funções e triggers
-- Fonte: 08_Banco_Dados.md §3

-- ============================================================================
-- 1. updated_at automático
-- ============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated      BEFORE UPDATE ON profiles      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_subs_updated          BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_businesses_updated    BEFORE UPDATE ON businesses    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_posts_updated         BEFORE UPDATE ON posts         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_content_updated       BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_events_updated        BEFORE UPDATE ON events        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_b2b_updated           BEFORE UPDATE ON b2b_partners  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 2. Cria profile + selo "recém-chegada" ao signup
-- IMPORTANTE: SET search_path = public é OBRIGATÓRIO em funções SECURITY DEFINER
-- chamadas a partir de triggers em outros schemas (auth.users). Sem isso,
-- o Postgres não acha as tabelas public.profiles e public.badges e o signup
-- falha com "Database error saving new user".
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nova membra'));

  INSERT INTO public.badges (user_id, code) VALUES (NEW.id, 'recem_chegada');
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Não bloqueia o signup se algo der errado na criação de profile/badge.
  RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. Contadores de reactions e comments
-- ============================================================================

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

-- ============================================================================
-- 4. Regras de negócio de POSTS (Divulgação, tipos admin, plano)
-- ============================================================================

CREATE OR REPLACE FUNCTION enforce_post_business_rules()
RETURNS TRIGGER AS $$
DECLARE
  v_plan plan_type;
  v_count INT;
BEGIN
  -- Tipos admin requerem role admin/moderator
  IF NEW.post_type IN ('desafio_admin','destaque_admin','aviso_admin') THEN
    IF NOT EXISTS (
      SELECT 1 FROM profiles
       WHERE id = NEW.author_id AND role IN ('admin','moderator')
    ) THEN
      RAISE EXCEPTION 'Apenas admin pode publicar post do tipo %', NEW.post_type;
    END IF;
    RETURN NEW;
  END IF;

  -- Membros precisam ter plano ativo
  SELECT current_plan INTO v_plan FROM profiles WHERE id = NEW.author_id;
  IF v_plan IS NULL THEN
    RAISE EXCEPTION 'Usuária sem assinatura ativa não pode publicar';
  END IF;

  -- Divulgação só Inata/Mentora, máx. 2/semana
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

-- ============================================================================
-- 5. Sincroniza profiles.current_plan com subscriptions.status
-- ============================================================================

CREATE OR REPLACE FUNCTION public.sync_profile_current_plan()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
     SET current_plan = (
        SELECT plan FROM public.subscriptions
         WHERE user_id = NEW.user_id
           AND status IN ('active','past_due','paused')
         ORDER BY updated_at DESC LIMIT 1
     )
   WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_plan
  AFTER INSERT OR UPDATE OF status, plan ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_current_plan();

-- ============================================================================
-- 6. Helper para selo "ativa" (chamado em cron, não trigger)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.maybe_award_active_badge(p_user UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_first_post TIMESTAMPTZ;
  v_first_event TIMESTAMPTZ;
  v_profile_ok BOOLEAN;
BEGIN
  SELECT MIN(created_at) INTO v_first_post FROM public.posts WHERE author_id = p_user;
  SELECT MIN(rsvp_at) INTO v_first_event FROM public.event_rsvps WHERE user_id = p_user;
  SELECT (avatar_url IS NOT NULL AND bio IS NOT NULL)
    INTO v_profile_ok FROM public.profiles WHERE id = p_user;

  IF v_profile_ok AND v_first_post IS NOT NULL AND v_first_event IS NOT NULL THEN
    INSERT INTO public.badges (user_id, code) VALUES (p_user, 'ativa')
    ON CONFLICT (user_id, code) DO NOTHING;
  END IF;
END;
$$;

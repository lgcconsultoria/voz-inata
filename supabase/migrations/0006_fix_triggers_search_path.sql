-- 0006_fix_triggers_search_path.sql
-- Fix idempotente: funções SECURITY DEFINER precisam de search_path explícito
-- para enxergar public.profiles e public.badges no contexto do schema auth.
-- Sintoma sem o fix: "Database error saving new user" durante signup.

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
  -- Registra warning no log do Postgres para análise.
  RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

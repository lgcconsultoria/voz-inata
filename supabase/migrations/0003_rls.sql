-- 0003_rls.sql — Row Level Security
-- Fonte: 08_Banco_Dados.md §4
-- A service_role do Supabase passa pelas políticas (bypass) — usar do lado server.

-- ============================================================================
-- 1. Habilitar RLS em todas as tabelas sensíveis
-- ============================================================================

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

-- ============================================================================
-- 2. Helpers
-- ============================================================================

CREATE OR REPLACE FUNCTION is_active_member()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
     WHERE id = auth.uid()
       AND current_plan IS NOT NULL
       AND is_blocked = FALSE
  );
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
     WHERE id = auth.uid() AND role IN ('admin','moderator')
  );
$$;

-- ============================================================================
-- 3. Políticas
-- ============================================================================

-- PROFILES
CREATE POLICY profiles_select_self_or_member ON profiles FOR SELECT
  USING (id = auth.uid() OR is_active_member() OR is_admin());
CREATE POLICY profiles_update_self ON profiles FOR UPDATE
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- SUBSCRIPTIONS / PAYMENTS — sempre escopadas à dona ou admin
CREATE POLICY subs_select_self ON subscriptions FOR SELECT
  USING (user_id = auth.uid() OR is_admin());
CREATE POLICY subs_insert_self ON subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid() OR is_admin());
CREATE POLICY payments_select_self ON payments FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- POSTS
CREATE POLICY posts_select_active ON posts FOR SELECT
  USING (
    (is_active_member() OR is_admin())
    AND status = 'published' AND deleted_at IS NULL
  );
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

-- BUSINESSES
CREATE POLICY businesses_select_active ON businesses FOR SELECT
  USING (
    (is_published AND is_visible AND is_active_member())
    OR user_id = auth.uid() OR is_admin()
  );
CREATE POLICY businesses_insert_self ON businesses FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
       WHERE id = auth.uid() AND current_plan IN ('inata','mentora')
    )
  );
CREATE POLICY businesses_update_self ON businesses FOR UPDATE
  USING (user_id = auth.uid());

-- CONTENT — gated por plano
CREATE POLICY content_select_by_plan ON content_items FOR SELECT
  USING (
    is_published AND (
      required_plan IS NULL OR
      EXISTS (
        SELECT 1 FROM profiles
         WHERE id = auth.uid() AND current_plan IS NOT NULL
           AND (
             required_plan = 'voz'
             OR current_plan = required_plan
             OR (required_plan = 'inata' AND current_plan IN ('inata','mentora'))
           )
      )
    ) OR is_admin()
  );

-- EVENTS / RSVPS
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

-- B2B / WAITLIST / ADMIN_LOGS
CREATE POLICY b2b_admin ON b2b_partners FOR ALL USING (is_admin());
CREATE POLICY waitlist_admin_select ON waitlist FOR SELECT USING (is_admin());
CREATE POLICY waitlist_insert_public ON waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY admin_logs_admin ON admin_logs FOR ALL USING (is_admin());

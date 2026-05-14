-- 0005_seed.sql — Seed inicial mínimo
-- Substitua o UUID da fundadora antes de aplicar (descubra com:
--   SELECT id, email FROM auth.users WHERE email = 'seu@email.com';
-- ).

-- Cupons da Oferta Fundadora (vagas limitadas)
INSERT INTO coupons (code, description, applies_to_plan, discount_kind, discount_value, max_redemptions)
VALUES
  ('FUNDADORA_VOZ',     'Voz a R$ 39 vitalício',      'voz',     'founder_price', 3900,  100),
  ('FUNDADORA_INATA',   'Inata a R$ 69 vitalício',    'inata',   'founder_price', 6900,  100),
  ('FUNDADORA_MENTORA', 'Mentora a R$ 199 vitalício', 'mentora', 'founder_price', 19900, 20)
ON CONFLICT (code) DO NOTHING;

-- Conteúdos de partida (boas-vindas + tutorial de catálogo)
INSERT INTO content_items (slug, title, kind, required_plan, is_published, published_at)
VALUES
  ('boas-vindas-fundadora',
   'Boas-vindas da Fundadora',
   'video', NULL, true, NOW()),
  ('como-montar-perfil-catalogo',
   'Como montar seu perfil no Catálogo',
   'video', 'inata', true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Para promover a fundadora a admin, rode após o signup:
-- UPDATE profiles
--    SET role = 'admin', current_plan = 'mentora'
--  WHERE id = '<UUID DA FUNDADORA>';

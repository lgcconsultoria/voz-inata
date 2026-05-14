-- 0004_indexes_search.sql — Índices adicionais e full-text search
-- Fonte: 08_Banco_Dados.md §6

-- Cursor para feed paginado
CREATE INDEX IF NOT EXISTS idx_posts_feed_cursor
  ON posts (created_at DESC, id DESC)
  WHERE deleted_at IS NULL AND status = 'published';

-- Full-text search no catálogo (PT-BR)
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS search_tsv tsvector GENERATED ALWAYS AS (
    to_tsvector('portuguese',
      coalesce(business_name,'') || ' ' ||
      coalesce(short_pitch,'')   || ' ' ||
      coalesce(description,'')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_businesses_search
  ON businesses USING GIN (search_tsv);

-- Filtro do grid do catálogo
CREATE INDEX IF NOT EXISTS idx_businesses_filter
  ON businesses (is_published, category, city)
  WHERE is_visible;

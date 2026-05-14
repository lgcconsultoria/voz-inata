import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { PostComposer } from "@/components/mural/post-composer"
import { PostCard, type MuralPost } from "@/components/mural/post-card"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  MEMBER_POST_TYPES,
  POST_TYPE_LABEL,
  isPostType,
  type PostType
} from "@/lib/mural/post-types"

export const metadata = { title: "Mural" }

type PageProps = {
  searchParams?: { type?: string }
}

export default async function MuralPage({ searchParams }: PageProps) {
  const supabase = createSupabaseServerClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single()

  const initial =
    (profile?.full_name ?? "M").trim()[0]?.toUpperCase() ?? "M"

  const activeFilter: PostType | null =
    searchParams?.type && isPostType(searchParams.type) ? searchParams.type : null

  // Post-âncora ativo (mais recente)
  const { data: anchorRow } = await supabase
    .from("posts")
    .select(
      "id, post_type, content, image_url, created_at, reactions_count, comments_count, is_anchor, author:profiles!posts_author_id_fkey(full_name, city, current_plan)"
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .eq("is_anchor", true)
    .gt("pinned_until", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const anchor = normalize(anchorRow)

  let feedQuery = supabase
    .from("posts")
    .select(
      "id, post_type, content, image_url, created_at, reactions_count, comments_count, is_anchor, author:profiles!posts_author_id_fkey(full_name, city, current_plan)"
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(50)

  if (activeFilter) {
    feedQuery = feedQuery.eq("post_type", activeFilter)
  }
  if (anchor) {
    feedQuery = feedQuery.neq("id", anchor.id)
  }

  const { data: feedRows } = await feedQuery
  const feed = (feedRows ?? []).map(normalize).filter((p): p is MuralPost => p !== null)

  return (
    <AppShell current="/mural" userInitial={initial}>
      <div className="container-wide grid gap-8 py-10 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          <PostComposer />

          {anchor && <PostCard post={anchor} anchor />}

          {/* FILTROS */}
          <div className="flex flex-wrap gap-2 text-sm">
            <FilterChip href="/mural" label="Tudo" active={activeFilter === null} />
            {MEMBER_POST_TYPES.map(t => (
              <FilterChip
                key={t}
                href={`/mural?type=${t}`}
                label={POST_TYPE_LABEL[t]}
                active={activeFilter === t}
              />
            ))}
          </div>

          {/* FEED */}
          {feed.length === 0 ? (
            <Card>
              <CardTitle>Ainda silencioso por aqui.</CardTitle>
              <CardContent className="mt-2">
                {activeFilter
                  ? "Nenhuma publicação desse tipo ainda. Tente outro filtro ou seja a primeira."
                  : "Seja a primeira a publicar — sua voz começa a comunidade."}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feed.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4 lg:col-span-4">
          <Card>
            <p className="kicker">esta semana</p>
            <CardTitle className="mt-3 text-lg">Próximo evento</CardTitle>
            <CardContent className="mt-2 text-argila">
              Quinta do Palco · 22 mai · Camila Andrade
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}

function FilterChip({
  href,
  label,
  active
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-full border px-3 py-1.5 text-sm transition-colors " +
        (active
          ? "border-verde bg-verde text-creme"
          : "border-areia bg-white text-tinta hover:border-verde/40")
      }
    >
      {label}
    </Link>
  )
}

// O Supabase pode devolver a relação `author` como objeto OU como array,
// dependendo de como o tipo da FK é inferido. Normalizamos pra `MuralPost`.
type RawAuthor = {
  full_name: string | null
  city: string | null
  current_plan: string | null
}
type RawPost = {
  id: string
  post_type: string
  content: string
  image_url: string | null
  created_at: string
  reactions_count: number
  comments_count: number
  is_anchor: boolean
  author: RawAuthor | RawAuthor[] | null
}

function normalize(row: RawPost | null | undefined): MuralPost | null {
  if (!row) return null
  if (!isPostType(row.post_type)) return null
  const author = Array.isArray(row.author) ? row.author[0] ?? null : row.author
  return {
    id: row.id,
    post_type: row.post_type,
    content: row.content,
    image_url: row.image_url,
    created_at: row.created_at,
    reactions_count: row.reactions_count,
    comments_count: row.comments_count,
    is_anchor: row.is_anchor,
    author: author
      ? {
          full_name: author.full_name,
          city: author.city,
          current_plan: author.current_plan
        }
      : null
  }
}

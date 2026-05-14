import { Card } from "@/components/ui/card"
import {
  POST_TYPE_LABEL,
  planBadge,
  relativeTime,
  type PostType
} from "@/lib/mural/post-types"

export type MuralPost = {
  id: string
  post_type: PostType
  content: string
  image_url: string | null
  created_at: string
  reactions_count: number
  comments_count: number
  is_anchor: boolean
  author: {
    full_name: string | null
    city: string | null
    current_plan: string | null
  } | null
}

export function PostCard({ post, anchor = false }: { post: MuralPost; anchor?: boolean }) {
  const name = post.author?.full_name ?? "Membra"
  const initial = name.trim()[0]?.toUpperCase() ?? "?"
  const city = post.author?.city
  const badge = planBadge(post.author?.current_plan)
  const when = relativeTime(post.created_at)

  return (
    <Card className={anchor ? "border-terracota/30 bg-areia/40" : undefined}>
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracota/20 text-sm font-medium text-terracota-600"
        >
          {initial}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-verde">{name}</span>
            {badge && <span className="text-xs text-argila">{badge}</span>}
            {city && <span className="text-xs text-argila">· {city}</span>}
            <span className="text-xs text-argila">· {when}</span>
          </div>
          <span className="mt-1 inline-block rounded-full bg-areia/60 px-2 py-0.5 text-[11px] text-tinta">
            {POST_TYPE_LABEL[post.post_type]}
          </span>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-tinta">
            {post.content}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-argila">
            <span>❤️ {post.reactions_count}</span>
            <span>💬 {post.comments_count}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

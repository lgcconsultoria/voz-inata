export const POST_TYPES = [
  "apresentacao",
  "intencao",
  "conquista",
  "indicacao",
  "divulgacao",
  "pergunta",
  "aprendizado",
  "oportunidade",
  "desafio_admin",
  "destaque_admin",
  "aviso_admin"
] as const

export type PostType = (typeof POST_TYPES)[number]

export const POST_TYPE_LABEL: Record<PostType, string> = {
  apresentacao:    "🌱 Apresentação",
  intencao:        "🎯 Intenção",
  conquista:       "🌟 Conquista",
  indicacao:       "🤝 Indica",
  divulgacao:      "💼 Negócio",
  pergunta:        "❓ Pergunta",
  aprendizado:     "💡 Aprendi",
  oportunidade:    "🚪 Oportunidade",
  desafio_admin:   "🔥 Desafio",
  destaque_admin:  "✨ Destaque",
  aviso_admin:     "📣 Aviso"
}

export const MEMBER_POST_TYPES: PostType[] = [
  "apresentacao",
  "intencao",
  "conquista",
  "indicacao",
  "divulgacao",
  "pergunta",
  "aprendizado",
  "oportunidade"
]

export function isPostType(value: string): value is PostType {
  return (POST_TYPES as readonly string[]).includes(value)
}

const PLAN_LABEL: Record<string, string> = {
  voz: "Voz",
  inata: "Inata",
  mentora: "💎 Parceira"
}

export function planBadge(plan: string | null | undefined): string | null {
  if (!plan) return null
  return PLAN_LABEL[plan] ?? null
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diffMs = Date.now() - then
  if (Number.isNaN(diffMs)) return ""

  const sec = Math.max(0, Math.floor(diffMs / 1000))
  if (sec < 60) return "agora"
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}min`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d`
  const wk = Math.floor(day / 7)
  if (wk < 5) return `${wk}sem`
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  })
}

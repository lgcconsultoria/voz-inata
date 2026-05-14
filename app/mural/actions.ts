"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { isPostType, MEMBER_POST_TYPES, type PostType } from "@/lib/mural/post-types"

export type CreatePostState = { ok?: true; error?: string }

export async function createPostAction(
  _prev: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const rawType = String(formData.get("post_type") ?? "")
  const content = String(formData.get("content") ?? "").trim()

  if (!isPostType(rawType) || !MEMBER_POST_TYPES.includes(rawType as PostType)) {
    return { error: "Escolha um tipo de publicação válido." }
  }
  if (content.length === 0) {
    return { error: "Escreva alguma coisa antes de publicar." }
  }
  if (content.length > 1500) {
    return { error: "O post pode ter no máximo 1500 caracteres." }
  }

  const supabase = createSupabaseServerClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Sua sessão expirou. Entra de novo, por favor." }
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    post_type: rawType,
    content
  })

  if (error) {
    return { error: traduzErroPost(error.message) }
  }

  revalidatePath("/mural")
  return { ok: true }
}

function traduzErroPost(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes("limite de 2 divulgações")) {
    return "Você já publicou 2 Divulgações esta semana. Volta segunda 🌱"
  }
  if (m.includes("divulgação do negócio é exclusiva")) {
    return "Divulgação do Negócio é exclusiva dos planos Inata e Mentora."
  }
  if (m.includes("sem assinatura ativa")) {
    return "Sua assinatura precisa estar ativa para publicar."
  }
  if (m.includes("apenas admin pode publicar")) {
    return "Este tipo de post é reservado para a equipe."
  }
  if (m.includes("char_length") || m.includes("content_check")) {
    return "O post precisa ter entre 1 e 1500 caracteres."
  }
  if (m.includes("row-level security") || m.includes("violates row-level")) {
    return "Sua assinatura precisa estar ativa para publicar."
  }
  return "Não consegui publicar agora. Tenta de novo em instantes."
}

"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server"

export type AuthState = { error?: string }

export async function signInAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Informe e-mail e senha." }
  }

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: traduzErroAuth(error.message) }
  }

  revalidatePath("/", "layout")
  redirect("/casa")
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const phone = String(formData.get("phone") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()
  const state = String(formData.get("state") ?? "").trim().toUpperCase()
  const plan = String(formData.get("plan") ?? "inata") as "voz" | "inata" | "mentora"

  if (!name || !email || !password) {
    return { error: "Preencha nome, e-mail e senha." }
  }
  if (password.length < 8) {
    return { error: "A senha precisa ter ao menos 8 caracteres." }
  }

  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/casa`
    }
  })

  if (error) {
    return { error: traduzErroAuth(error.message) }
  }
  if (!data.user) {
    return { error: "Não foi possível criar sua conta. Tente novamente." }
  }

  // Atualiza o profile criado pela trigger handle_new_user com os campos do cadastro.
  // Usa service_role pra contornar RLS — operação interna confiável.
  const admin = createSupabaseServiceRoleClient()
  await admin
    .from("profiles")
    .update({
      full_name: name,
      city: city || null,
      state: state || null,
      phone: phone || null,
      // No MVP esqueleto entramos já com o plano "ativo" sem cobrança.
      // Quando o Stripe estiver integrado, o plano só vira ativo após pagamento.
      current_plan: plan
    })
    .eq("id", data.user.id)

  revalidatePath("/", "layout")

  // Se confirmação por e-mail estiver desativada no Supabase, já entra logado.
  // Se estiver ativada, redireciona pra tela de aviso.
  if (data.session) {
    redirect("/casa")
  }

  redirect("/cadastro/confirme-email")
}

export async function signOutAction() {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

function traduzErroAuth(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes("invalid login") || m.includes("invalid credentials")) {
    return "E-mail ou senha incorretos."
  }
  if (m.includes("user already registered") || m.includes("already exists")) {
    return "Já existe uma conta com esse e-mail. Tente entrar."
  }
  if (m.includes("password should be at least")) {
    return "A senha precisa ter ao menos 8 caracteres."
  }
  if (m.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar."
  }
  if (m.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente de novo."
  }
  return msg
}

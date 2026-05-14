// Cliente Supabase para SERVER side: Server Components, Server Actions,
// Route Handlers. Lê e escreve cookies para manter a sessão sincronizada.
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Server Component está tentando setar cookie. O middleware
            // já cuida do refresh — ignorar é seguro aqui.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch {
            // mesmo motivo do set()
          }
        }
      }
    }
  )
}

// Cliente com SERVICE_ROLE — bypassa RLS. Use APENAS em código server-side
// confiável (cron, webhooks, scripts admin). NUNCA exponha no browser.
import { createClient } from "@supabase/supabase-js"

export function createSupabaseServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

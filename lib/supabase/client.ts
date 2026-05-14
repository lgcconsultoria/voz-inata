// Cliente Supabase para uso no BROWSER (Client Components, event handlers).
// Para Server Components, Server Actions e Route Handlers, use ./server.ts.
import { createBrowserClient } from "@supabase/ssr"

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

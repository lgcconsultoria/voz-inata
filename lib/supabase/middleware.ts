// Helper consumido por /middleware.ts (na raiz). Atualiza a sessão a cada
// request e devolve a response com os cookies atualizados.
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers }
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: "", ...options })
        }
      }
    }
  )

  // Refresh do token se necessário
  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Rotas que exigem autenticação
  const protectedPaths = [
    "/casa",
    "/mural",
    "/biblioteca",
    "/agenda",
    "/catalogo",
    "/perfil"
  ]
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/entrar"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // Se já está logada e tentou ir para /entrar ou /cadastro, manda pra /casa
  if (user && (pathname === "/entrar" || pathname === "/cadastro")) {
    const url = request.nextUrl.clone()
    url.pathname = "/casa"
    return NextResponse.redirect(url)
  }

  return response
}

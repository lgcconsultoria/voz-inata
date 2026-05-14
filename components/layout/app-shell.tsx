import Link from "next/link"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string; icon: string }

const nav: NavItem[] = [
  { href: "/casa",       label: "Casa",       icon: "🏠" },
  { href: "/mural",      label: "Mural",      icon: "💬" },
  { href: "/biblioteca", label: "Biblioteca", icon: "📚" },
  { href: "/agenda",     label: "Agenda",     icon: "📅" },
  { href: "/catalogo",   label: "Catálogo",   icon: "🗂️" },
  { href: "/perfil",     label: "Perfil",     icon: "👤" }
]

export function AppShell({
  children,
  current,
  userInitial = "?"
}: {
  children: React.ReactNode
  current: string
  userInitial?: string
}) {
  return (
    <div className="min-h-screen bg-creme">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-areia/70 bg-creme/80 backdrop-blur">
        <div className="container-wide flex h-16 items-center justify-between">
          <Link href="/casa" className="font-display text-xl font-semibold text-verde">
            Voz Inata
          </Link>
          <nav className="hidden gap-6 text-sm text-verde md:flex">
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-terracota",
                  current === item.href && "text-terracota"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sair" className="hidden text-sm text-argila hover:text-terracota sm:inline">
              Sair
            </Link>
            <span
              aria-label="Avatar"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-terracota text-sm font-medium text-white"
            >
              {userInitial}
            </span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="pb-24 md:pb-12">{children}</main>

      {/* BOTTOM NAV (mobile) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-areia/70 bg-creme/95 backdrop-blur md:hidden"
        aria-label="Navegação"
      >
        <ul className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
          {nav.slice(0, 5).map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-[11px] text-argila transition-colors hover:text-terracota",
                  current === item.href && "text-terracota"
                )}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

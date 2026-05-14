import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-areia/70 bg-creme/80 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold text-verde">
          Voz Inata
        </Link>
        <nav className="hidden gap-8 text-sm text-verde md:flex">
          <a href="#pilares" className="hover:text-terracota">Como funciona</a>
          <a href="#semana" className="hover:text-terracota">A semana aqui</a>
          <a href="#planos" className="hover:text-terracota">Planos</a>
          <a href="#faq" className="hover:text-terracota">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/entrar" className="hidden text-sm text-verde hover:text-terracota sm:inline">
            Entrar
          </Link>
          <Link href="/cadastro">
            <Button size="sm">Quero entrar</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

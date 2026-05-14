import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-lilas-100/80 bg-creme/85 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl font-extrabold tracking-tight text-lilas-800 group-hover:text-lilas-600">
            voz<span className="text-menta-400">·</span>inata
          </span>
          <span className="hidden text-[10px] uppercase tracking-brand text-lilas-500 sm:inline">
            conexão, presença e alma
          </span>
        </Link>
        <nav className="hidden gap-8 text-sm text-lilas-700 md:flex">
          <a href="#pilares" className="hover:text-lilas-500">Como funciona</a>
          <a href="#semana"  className="hover:text-lilas-500">A semana aqui</a>
          <a href="#planos"  className="hover:text-lilas-500">Planos</a>
          <a href="#faq"     className="hover:text-lilas-500">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/entrar" className="hidden text-sm text-lilas-700 hover:text-lilas-500 sm:inline">
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

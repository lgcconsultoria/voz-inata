import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-areia/70 bg-verde text-creme">
      <div className="container-wide grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Voz Inata</p>
          <p className="mt-2 max-w-sm text-sm text-creme/80">
            Comunidade digital feminina por assinatura. Aprendizado, agenda viva, mural curado e catálogo de
            negócios — em um só lugar.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="mb-3 font-medium text-creme">Plataforma</p>
            <ul className="space-y-2 text-creme/80">
              <li><Link href="/entrar" className="hover:text-terracota-200">Entrar</Link></li>
              <li><Link href="/cadastro" className="hover:text-terracota-200">Quero entrar</Link></li>
              <li><Link href="/casa" className="hover:text-terracota-200">Área das membras</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-medium text-creme">Institucional</p>
            <ul className="space-y-2 text-creme/80">
              <li><a href="#" className="hover:text-terracota-200">Sobre</a></li>
              <li><a href="#" className="hover:text-terracota-200">Termos de uso</a></li>
              <li><a href="#" className="hover:text-terracota-200">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="text-sm text-creme/70">
          <p className="mb-3 font-medium text-creme">Acompanhe</p>
          <p>Instagram · YouTube · Newsletter</p>
          <p className="mt-6 text-xs text-creme/60">
            © {new Date().getFullYear()} Voz Inata. Feito no Brasil.
          </p>
        </div>
      </div>
    </footer>
  )
}

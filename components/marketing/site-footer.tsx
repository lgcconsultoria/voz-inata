import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-lilas-200/40 bg-lilas-900 text-creme">
      <div className="orb left-[-6%] top-[-40%] h-[340px] w-[340px] opacity-25" />
      <div className="container-wide relative grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight">
            voz<span className="text-menta-400">·</span>inata
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-brand text-lavanda">
            conexão · presença · alma
          </p>
          <p className="mt-5 max-w-sm text-sm text-creme/80">
            Uma comunidade onde mulheres crescem em rede.
            Aprendizado, agenda viva, mural curado e catálogo de negócios — em um só lugar.
          </p>
          <p className="mt-6 font-script text-xl text-lavanda/90">
            e mais um tanto…
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="kicker mb-3 text-lavanda">plataforma</p>
            <ul className="space-y-2 text-creme/80">
              <li><Link href="/entrar"   className="hover:text-menta-200">Entrar</Link></li>
              <li><Link href="/cadastro" className="hover:text-menta-200">Quero entrar</Link></li>
              <li><Link href="/casa"     className="hover:text-menta-200">Área das membras</Link></li>
            </ul>
          </div>
          <div>
            <p className="kicker mb-3 text-lavanda">institucional</p>
            <ul className="space-y-2 text-creme/80">
              <li><a href="#" className="hover:text-menta-200">Sobre</a></li>
              <li><a href="#" className="hover:text-menta-200">Termos de uso</a></li>
              <li><a href="#" className="hover:text-menta-200">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="text-sm text-creme/70">
          <p className="kicker mb-3 text-lavanda">acompanhe</p>
          <p>Instagram · YouTube · Newsletter</p>
          <p className="mt-8 text-xs text-creme/55">
            © {new Date().getFullYear()} Voz Inata · criado com presença.
          </p>
        </div>
      </div>
    </footer>
  )
}

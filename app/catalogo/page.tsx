import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export const metadata = { title: "Catálogo" }

const featured = {
  name: "Atelier Raiz · Moda autoral",
  pitch: "Roupas com algodão orgânico e tingimento natural feitos por mulheres no interior de SP.",
  city: "Sorocaba/SP"
}

const businesses = [
  { name: "Marina Oliveira · Psicologia parental", cat: "Saúde mental", city: "Belo Horizonte/MG", badge: "✋ Ativa" },
  { name: "Camila Borba · Atelier Raiz",           cat: "Moda",          city: "Sorocaba/SP",       badge: "💎 Parceira" },
  { name: "Rafaela Lima · Consultoria de Vendas",  cat: "Negócios",      city: "Curitiba/PR",       badge: "💎 Parceira" },
  { name: "Nina Souza · Branding feminino",        cat: "Marketing",     city: "São Paulo/SP",      badge: "🤝 Conectora" },
  { name: "Júlia Tavares · Direito Imobiliário",   cat: "Jurídico",      city: "Recife/PE",         badge: "✋ Ativa" },
  { name: "Bia Martins · Contabilidade MEI/PJ",    cat: "Finanças",      city: "Florianópolis/SC",  badge: "✋ Ativa" }
]

export default function CatalogPage() {
  return (
    <AppShell current="/catalogo">
      <div className="container-wide py-10">
        <span className="kicker">criação consciente</span>
        <h1 className="mt-2 font-display text-3xl text-lilas-800 sm:text-4xl">Catálogo de Negócios</h1>
        <p className="mt-3 max-w-2xl text-tinta/85">
          Mulheres que você pode contratar, indicar e fazer rede. Curado pela comunidade.
        </p>

        <div className="mt-8 flex flex-wrap gap-2 text-sm">
          <input
            className="flex-1 min-w-[200px] rounded-xl border border-lilas-100 bg-white px-4 py-2 placeholder:text-argila/70 focus:border-lilas-500 focus:outline-none focus:ring-2 focus:ring-lilas-300/40"
            placeholder="Buscar por nome, serviço ou cidade..."
          />
          <Button size="sm" variant="outline">Categoria</Button>
          <Button size="sm" variant="outline">Cidade</Button>
          <Button size="sm" variant="ghost">Só Parceiras</Button>
        </div>

        {/* DESTAQUE */}
        <Card className="relative mt-8 flex flex-col gap-6 overflow-hidden border-lilas-200 bg-gradient-to-br from-white via-lilas-50 to-lavanda/40 md:flex-row md:items-center">
          <div className="orb right-[-8%] top-[-50%] h-[260px] w-[260px] opacity-50" />
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-menta/40 font-display text-4xl text-lilas-800">
            ✦
          </div>
          <div className="relative flex-1">
            <p className="kicker">negócio em evidência · esta semana</p>
            <CardTitle className="mt-2">{featured.name}</CardTitle>
            <CardContent className="mt-2 text-argila">{featured.pitch}</CardContent>
            <p className="mt-2 text-xs text-argila">{featured.city}</p>
          </div>
          <Button size="md">Conhecer →</Button>
        </Card>

        {/* GRID */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map(b => (
            <Card key={b.name}>
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lilas-100 text-2xl font-bold text-lilas-700">
                {b.name[0]}
              </span>
              <CardTitle className="mt-4 text-base leading-tight">{b.name}</CardTitle>
              <p className="mt-1 text-xs text-argila">{b.badge}</p>
              <p className="mt-3 text-sm text-tinta">{b.cat}</p>
              <p className="mt-1 text-xs text-argila">{b.city}</p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <Button size="sm" variant="outline">WhatsApp</Button>
                <Button size="sm" variant="ghost">Ver perfil →</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

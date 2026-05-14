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
        <h1 className="font-display text-3xl text-verde sm:text-4xl">Catálogo de Negócios</h1>
        <p className="mt-2 max-w-2xl text-tinta/85">
          Mulheres que você pode contratar, indicar e fazer rede. Curado pela comunidade.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <input
            className="flex-1 min-w-[200px] rounded-lg border border-areia bg-white px-4 py-2 placeholder:text-argila/70 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/30"
            placeholder="Buscar por nome, serviço ou cidade..."
          />
          <Button size="sm" variant="outline">Categoria</Button>
          <Button size="sm" variant="outline">Cidade</Button>
          <Button size="sm" variant="ghost">Só Parceiras</Button>
        </div>

        {/* DESTAQUE */}
        <Card className="mt-8 flex flex-col gap-6 border-terracota/30 bg-gradient-to-br from-white to-terracota/10 md:flex-row md:items-center">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-terracota/20 font-display text-3xl text-terracota">
            ✨
          </div>
          <div className="flex-1">
            <span className="text-xs font-medium uppercase tracking-wider text-terracota">
              Negócio em Evidência · esta semana
            </span>
            <CardTitle className="mt-2">{featured.name}</CardTitle>
            <CardContent className="mt-2 text-argila">{featured.pitch}</CardContent>
            <p className="mt-2 text-xs text-argila">📍 {featured.city}</p>
          </div>
          <Button size="md">Conhecer →</Button>
        </Card>

        {/* GRID */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map(b => (
            <Card key={b.name}>
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-areia/60 text-2xl text-terracota">
                {b.name[0]}
              </span>
              <CardTitle className="mt-4 text-base leading-tight">{b.name}</CardTitle>
              <p className="mt-1 text-xs text-argila">{b.badge}</p>
              <p className="mt-3 text-sm text-tinta">{b.cat}</p>
              <p className="mt-1 text-xs text-argila">📍 {b.city}</p>
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

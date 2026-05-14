import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export const metadata = { title: "Mural" }

const postTypes = [
  { code: "intencao",     label: "🎯 Intenção" },
  { code: "conquista",    label: "🌟 Conquista" },
  { code: "indicacao",    label: "🤝 Indica" },
  { code: "divulgacao",   label: "💼 Negócio" },
  { code: "pergunta",     label: "❓ Pergunta" },
  { code: "aprendizado",  label: "💡 Aprendi" },
  { code: "oportunidade", label: "🚪 Oportunidade" }
]

const samplePosts = [
  {
    author: "Marina Oliveira",
    badge: "✋ Ativa",
    city: "Belo Horizonte",
    when: "2h",
    type: "🌟 Conquista",
    content:
      "Fechei meu primeiro pacote anual de psicoterapia parental hoje. Aprendi aqui que precificar com clareza é uma forma de cuidar de mim também."
  },
  {
    author: "Camila Borba",
    badge: "💎 Parceira",
    city: "Sorocaba",
    when: "5h",
    type: "💼 Negócio",
    content:
      "Atelier Raiz acabou de lançar uma cápsula de inverno feita só com algodão orgânico do interior. Frete grátis pra membras da Voz Inata até dia 20."
  },
  {
    author: "Júlia Tavares",
    badge: "🌱 Recém-chegada",
    city: "São Paulo",
    when: "1d",
    type: "🤝 Indica",
    content:
      "Procuro uma contadora especialista em MEI / Simples Nacional. Tem indicação aqui na comunidade?"
  }
]

export default function MuralPage() {
  return (
    <AppShell current="/mural">
      <div className="container-wide grid gap-8 py-10 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          {/* POST-ÂNCORA */}
          <Card className="border-terracota/30 bg-areia/40">
            <span className="text-xs font-medium uppercase tracking-wider text-terracota">
              📣 Post-âncora · Segunda da Intenção
            </span>
            <CardTitle className="mt-2">Qual sua intenção para esta semana?</CardTitle>
            <CardContent className="mt-2 text-argila">
              Responda em uma frase. Equipe responde aos 10 primeiros. 142 mulheres já participaram.
            </CardContent>
            <div className="mt-4 flex gap-2">
              <input
                className="flex-1 rounded-lg border border-areia bg-white px-4 text-sm placeholder:text-argila/70 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/30"
                placeholder="Esta semana eu quero..."
              />
              <Button size="md">Publicar</Button>
            </div>
          </Card>

          {/* FILTROS */}
          <div className="flex flex-wrap gap-2 text-sm">
            <Button size="sm" variant="outline">Tudo</Button>
            {postTypes.map(t => (
              <Button key={t.code} size="sm" variant="ghost">
                {t.label}
              </Button>
            ))}
          </div>

          {/* FEED */}
          <div className="space-y-4">
            {samplePosts.map(p => (
              <Card key={p.author}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracota/20 text-sm font-medium text-terracota-600">
                    {p.author[0]}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-verde">{p.author}</span>
                      <span className="text-xs text-argila">{p.badge}</span>
                      <span className="text-xs text-argila">· {p.city} · {p.when}</span>
                    </div>
                    <span className="mt-1 inline-block rounded-full bg-areia/60 px-2 py-0.5 text-[11px] text-tinta">
                      {p.type}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-tinta">{p.content}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-argila">
                      <button className="hover:text-terracota">❤️ Curtir</button>
                      <button className="hover:text-terracota">💬 Comentar</button>
                      <button className="hover:text-terracota">↗️ Compartilhar</button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <aside className="space-y-4 lg:col-span-4">
          <Card>
            <p className="text-xs font-medium uppercase tracking-wider text-terracota">
              Esta semana
            </p>
            <CardTitle className="mt-2 text-lg">Próximo evento</CardTitle>
            <CardContent className="mt-2 text-argila">
              Quinta do Palco · 22 mai · Camila Andrade
            </CardContent>
          </Card>
          <Card className="bg-areia/40">
            <p className="text-xs font-medium uppercase tracking-wider text-terracota">
              Recém-chegadas
            </p>
            <ul className="mt-3 space-y-2 text-sm text-tinta">
              <li>Júlia · São Paulo</li>
              <li>Bia · Recife</li>
              <li>Helena · Curitiba</li>
            </ul>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export const metadata = { title: "Biblioteca" }

const items = [
  {
    title: "Precificar sem culpa",
    cat: "Vendas",
    duration: "32 min",
    plan: "Inata",
    desc: "Como construir uma tabela de preços que reflita o valor do seu trabalho."
  },
  {
    title: "Marca pessoal feminina sem virar caricatura",
    cat: "Branding",
    duration: "5 vídeos · 1h12",
    plan: "Inata",
    desc: "Trilha curta com templates de bio, roteiros e referências de tom."
  },
  {
    title: "Finanças PJ para quem está começando",
    cat: "Finanças",
    duration: "28 min",
    plan: "Voz",
    desc: "Pró-labore, separação CPF/CNPJ e o básico para não se enrolar no MEI."
  },
  {
    title: "Roda de Trocas: como sair da exaustão",
    cat: "Autoconhecimento",
    duration: "Conversa · 48 min",
    plan: "Inata",
    desc: "Gravação do círculo temático mensal sobre desgaste emocional na carreira."
  }
]

export default function LibraryPage() {
  return (
    <AppShell current="/biblioteca">
      <div className="container-wide py-10">
        <h1 className="font-display text-3xl text-verde sm:text-4xl">Biblioteca</h1>
        <p className="mt-2 max-w-2xl text-tinta/85">
          Conteúdo curado, prático e enxuto. Sem maratona. Com aplicação real.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map(it => (
            <Card key={it.title}>
              <div className="aspect-video rounded-lg bg-gradient-to-br from-terracota-200 via-areia to-salvia" />
              <span className="mt-4 inline-block rounded-full bg-areia/60 px-2 py-0.5 text-[11px] text-tinta">
                {it.cat}
              </span>
              <CardTitle className="mt-2 text-lg">{it.title}</CardTitle>
              <CardContent className="mt-2 text-argila">{it.desc}</CardContent>
              <div className="mt-4 flex items-center justify-between text-xs text-argila">
                <span>⏱ {it.duration}</span>
                <span className="rounded-full border border-areia px-2 py-0.5 text-tinta">
                  Plano {it.plan}+
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

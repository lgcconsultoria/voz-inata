import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export const metadata = { title: "Agenda" }

const events = [
  {
    day: "SEG",
    date: "19 mai",
    time: "10h",
    kind: "Live de Abertura",
    title: "Abertura da semana + Intenções",
    host: "Voz Inata",
    badge: "Aberto a todas"
  },
  {
    day: "QUI",
    date: "22 mai",
    time: "20h",
    kind: "Quinta do Palco",
    title: "Precificar sem culpa",
    host: "Camila Andrade",
    badge: "Inata+"
  },
  {
    day: "TER",
    date: "27 mai",
    time: "19h",
    kind: "Círculo Temático",
    title: "Vendas para quem odeia vender",
    host: "Rafaela Lima",
    badge: "Inata+"
  },
  {
    day: "QUI",
    date: "29 mai",
    time: "20h",
    kind: "Quinta do Palco",
    title: "Marca pessoal e autoconhecimento",
    host: "Nina Souza",
    badge: "Inata+"
  }
]

export default function AgendaPage() {
  return (
    <AppShell current="/agenda">
      <div className="container-wide py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kicker">ritmo de comunidade</span>
            <h1 className="mt-2 font-display text-3xl text-lilas-800 sm:text-4xl">Agenda</h1>
            <p className="mt-3 max-w-xl text-tinta/85">
              A semana inteira em um só lugar. Inscreva-se e receba os lembretes.
            </p>
          </div>
          <div className="flex gap-2 text-sm">
            <Button size="sm" variant="outline">Semana</Button>
            <Button size="sm" variant="ghost">Mês</Button>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          {events.map(e => (
            <Card key={e.title} className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              <div className="flex shrink-0 items-center gap-4 md:flex-col md:items-start">
                <p className="font-display text-3xl text-lilas-500 title-spaced">{e.day}</p>
                <div className="text-sm text-argila">
                  <p>{e.date}</p>
                  <p>{e.time}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="kicker">{e.kind}</p>
                <CardTitle className="mt-2 text-lg">{e.title}</CardTitle>
                <CardContent className="mt-1 text-argila">
                  Apresentado por {e.host}
                </CardContent>
              </div>
              <div className="flex flex-col items-stretch gap-2 md:items-end">
                <span className="rounded-full border border-lilas-200 bg-lilas-50 px-3 py-1 text-xs text-lilas-700">
                  {e.badge}
                </span>
                <Button size="sm">Quero participar</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

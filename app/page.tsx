import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"

const pillars = [
  {
    icon: "📚",
    title: "Aprenda",
    description: "Aulas práticas e materiais curados — sem maratona, com aplicação real."
  },
  {
    icon: "📅",
    title: "Agenda viva",
    description: "Encontros ao vivo toda semana com mulheres de referência."
  },
  {
    icon: "💬",
    title: "Pertença",
    description: "Mural sem ruído, com rituais semanais que criam vínculo real."
  },
  {
    icon: "🗂️",
    title: "Apareça",
    description: "Seu negócio no catálogo — visto e indicado por outras mulheres."
  }
]

const week = [
  { day: "SEG", ritual: "Live de Abertura + Intenção da Semana" },
  { day: "TER", ritual: "Conteúdo Educativo" },
  { day: "QUA", ritual: "Quarta do Negócio" },
  { day: "QUI", ritual: "Quinta do Palco — evento ao vivo" },
  { day: "SEX", ritual: "Sexta de Indicações" },
  { day: "SÁB", ritual: "Conteúdo Leve" },
  { day: "DOM", ritual: "Silêncio + digest da semana" }
]

const plans = [
  {
    name: "Voz",
    role: "Para começar",
    price: "49",
    yearly: "ou R$ 470/ano",
    perks: [
      "Mural da comunidade",
      "Biblioteca completa de conteúdo",
      "1 evento ao vivo por mês",
      "Perfil pessoal com selos"
    ],
    cta: "Quero o plano Voz",
    highlighted: false
  },
  {
    name: "Inata",
    role: "Plano âncora",
    price: "89",
    yearly: "ou R$ 854/ano",
    perks: [
      "Tudo do Voz, mais:",
      "Espaço próprio no Catálogo",
      "Todos os eventos ao vivo",
      "Quarta do Negócio + Círculos temáticos"
    ],
    cta: "Assinar Inata",
    highlighted: true
  },
  {
    name: "Mentora",
    role: "Vagas limitadas",
    price: "249",
    yearly: "ou R$ 2.490/ano",
    perks: [
      "Tudo do Inata, mais:",
      "1 Quinta do Palco por trimestre",
      "Destaque rotativo no Catálogo",
      "Encontros restritos com a fundadora"
    ],
    cta: "Quero ser Mentora",
    highlighted: false
  }
]

const faqs = [
  {
    q: "Como funciona a assinatura?",
    a: "Mensal ou anual. Cobrança recorrente automática no cartão ou Pix. Você pode pausar até 60 dias por ano ou cancelar quando quiser, sem multa."
  },
  {
    q: "Posso trocar de plano depois?",
    a: "Sim. Você pode subir para Inata ou Mentora a qualquer momento — e descer também. Cobrança ajustada proporcionalmente."
  },
  {
    q: "Como funcionam as vagas de Parceira Mentora?",
    a: "São 20 vagas no MVP, com contrato mínimo de 3 meses. Você pode se candidatar depois de 6 meses como Inata."
  },
  {
    q: "É só para mulheres no Brasil?",
    a: "Sim. A comunidade nasce com foco no Brasil — eventos em português, no fuso de Brasília, com identidade nacional."
  }
]

export default function LandingPage() {
  return (
    <main className="bg-creme">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-wide grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center rounded-full bg-areia/60 px-3 py-1 text-xs font-medium text-verde">
              Vagas fundadoras com preço travado vitalício
            </span>
            <h1 className="mt-6 font-display text-4xl leading-tight text-verde sm:text-5xl lg:text-6xl">
              Sua voz nasceu pra ter rede.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-tinta/85">
              Uma comunidade digital pra mulheres que querem crescer em rede — com aprendizado,
              agenda viva, mural curado e visibilidade pro seu negócio. Tudo em um só lugar, com
              identidade própria.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/cadastro">
                <Button size="lg">Quero fazer parte</Button>
              </Link>
              <Link href="/entrar" className="text-sm text-verde hover:text-terracota">
                Já sou membra — entrar →
              </Link>
            </div>
            <p className="mt-6 text-sm text-argila">
              ⌛ 23 de 100 vagas Fundadoras Inata restantes (mockup)
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-areia shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-terracota-200 via-areia to-salvia" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-display text-3xl text-verde-800/80">
                  Voz Inata
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section id="pilares" className="border-t border-areia/70 bg-white py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-verde sm:text-4xl">
            Quatro pilares, um só lugar.
          </h2>
          <p className="mt-4 max-w-2xl text-tinta/85">
            A Voz Inata combina o que estava espalhado em mil grupos: aprendizado, encontro,
            convivência e visibilidade. Tudo curado, sem o ruído do WhatsApp.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(p => (
              <Card key={p.title} className="bg-creme/60">
                <div className="text-3xl">{p.icon}</div>
                <CardTitle className="mt-4">{p.title}</CardTitle>
                <CardContent className="mt-2 text-argila">{p.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SEMANA */}
      <section id="semana" className="py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-verde sm:text-4xl">
            Uma semana na Voz Inata.
          </h2>
          <p className="mt-4 max-w-2xl text-tinta/85">
            A comunidade tem ritmo. Cada dia traz um ritual com propósito — você sabe o que esperar
            e o que entregar.
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-7">
            {week.map(w => (
              <li
                key={w.day}
                className="rounded-xl border border-areia bg-white p-4 text-center shadow-sm"
              >
                <p className="font-display text-2xl text-terracota">{w.day}</p>
                <p className="mt-2 text-xs text-argila">{w.ritual}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="border-y border-areia/70 bg-areia/30 py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-verde sm:text-4xl">
            Três jeitos de fazer parte.
          </h2>
          <p className="mt-4 max-w-2xl text-tinta/85">
            Comece pelo plano que faz sentido pra você hoje. Pode subir ou descer quando quiser.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map(plan => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "border-terracota bg-white shadow-lg ring-2 ring-terracota/30"
                    : "bg-white"
                }
              >
                <p className="text-xs font-medium uppercase tracking-wider text-terracota">
                  {plan.role}
                </p>
                <CardTitle className="mt-2 text-2xl">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-xs text-argila">R$</span>
                  <span className="font-display text-4xl text-verde">{plan.price}</span>
                  <span className="text-sm text-argila">/mês</span>
                </div>
                <p className="text-xs text-argila">{plan.yearly}</p>
                <ul className="mt-6 space-y-2 text-sm text-tinta">
                  {plan.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracota" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link href="/cadastro" className="mt-6 block">
                  <Button
                    variant={plan.highlighted ? "primary" : "outline"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-argila">
            Pause até 60 dias por ano. Cancele quando quiser, sem multa.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container-tight">
          <h2 className="font-display text-3xl text-verde sm:text-4xl">Perguntas frequentes</h2>
          <div className="mt-10 space-y-4">
            {faqs.map(f => (
              <details
                key={f.q}
                className="group rounded-xl border border-areia bg-white p-5"
              >
                <summary className="cursor-pointer list-none text-base font-medium text-verde marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="text-terracota transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-tinta/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-areia/70 bg-verde py-20 text-creme">
        <div className="container-tight text-center">
          <h2 className="font-display text-3xl sm:text-4xl">
            Você está a um clique de fazer parte.
          </h2>
          <p className="mt-4 text-creme/80">
            Vagas fundadoras com preço travado vitalício — enquanto durarem.
          </p>
          <Link href="/cadastro" className="mt-8 inline-block">
            <Button size="lg" className="bg-terracota hover:bg-terracota-500">
              Quero fazer parte
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

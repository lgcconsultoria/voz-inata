import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"

const pillars = [
  {
    icon: "✦",
    title: "aprender",
    description:
      "Aulas práticas e materiais curados. Conhecimento aplicável, sem ruído nem maratona."
  },
  {
    icon: "◐",
    title: "encontrar",
    description:
      "Agenda viva de eventos ao vivo, toda semana, com mulheres de referência."
  },
  {
    icon: "○",
    title: "pertencer",
    description:
      "Um mural com rituais semanais e tom curado. Conversa de verdade, sem barulho."
  },
  {
    icon: "✧",
    title: "aparecer",
    description:
      "Seu negócio no catálogo — visto, indicado, sustentado por outras mulheres."
  }
]

const week = [
  { day: "SEG", ritual: "Live de Abertura · Intenção da Semana" },
  { day: "TER", ritual: "Conteúdo Educativo" },
  { day: "QUA", ritual: "Quarta do Negócio" },
  { day: "QUI", ritual: "Quinta do Palco · evento ao vivo" },
  { day: "SEX", ritual: "Sexta de Indicações" },
  { day: "SÁB", ritual: "Conteúdo Leve" },
  { day: "DOM", ritual: "Silêncio · digest da semana" }
]

const plans = [
  {
    name: "Voz",
    role: "para começar",
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
    role: "plano-âncora",
    price: "89",
    yearly: "ou R$ 854/ano",
    perks: [
      "Tudo do Voz, mais:",
      "Espaço próprio no Catálogo",
      "Todos os eventos ao vivo",
      "Quarta do Negócio e Círculos temáticos"
    ],
    cta: "Assinar Inata",
    highlighted: true
  },
  {
    name: "Mentora",
    role: "vagas limitadas",
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

      {/* HERO — vídeo de fundo */}
      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-tinta">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/og-default.png"
          aria-hidden
        >
          <source src="/video/nova-era.mp4" type="video/mp4" />
        </video>

        {/* gradiente de legibilidade — escurece o vídeo, com tom lilás no topo */}
        <div className="absolute inset-0 bg-gradient-to-b from-lilas-900/40 via-tinta/55 to-tinta/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,168,232,0.35),transparent_55%)]" />

        {/* orbe decorativo */}
        <div className="orb left-[-12%] top-[55%] h-[420px] w-[420px] hidden md:block animate-orb-float" />

        <div className="container-wide relative z-10 flex h-full items-center">
          <div className="max-w-3xl text-creme">
            <span className="kicker text-lavanda animate-fade-in-up">
              c o n e x ã o · p r e s e n ç a · a l m a
            </span>
            <h1
              className="mt-6 font-display text-5xl leading-[1.04] text-creme sm:text-6xl lg:text-7xl animate-fade-in-up"
              style={{ animationDelay: "120ms" }}
            >
              O que é essencial<br />é <em className="not-italic text-orbe">inato</em>.
            </h1>
            <p
              className="mt-8 max-w-xl text-lg text-creme/85 animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              Voz Inata é uma comunidade onde mulheres crescem em rede.
              Aprendizado, agenda viva, mural curado e visibilidade pro seu negócio —
              em um único espaço, com tom próprio.
            </p>
            <div
              className="mt-10 flex flex-wrap items-center gap-5 animate-fade-in-up"
              style={{ animationDelay: "360ms" }}
            >
              <Link href="/cadastro">
                <Button size="lg">Quero fazer parte</Button>
              </Link>
              <Link
                href="/entrar"
                className="text-sm text-creme/85 underline-offset-4 hover:text-creme hover:underline"
              >
                Já sou membra — entrar →
              </Link>
            </div>
            <p
              className="mt-10 font-script text-2xl text-lavanda/90 animate-fade-in-up"
              style={{ animationDelay: "520ms" }}
            >
              e mais um tanto…
            </p>
          </div>
        </div>

        {/* gradiente inferior de transição suave para o creme */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-creme" />
      </section>

      {/* MANIFESTO — frase única, respiro alto, tipografia editorial */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="orb right-[-8%] top-[-10%] h-[360px] w-[360px] hidden md:block" />
        <div className="container-tight relative text-center">
          <span className="kicker">manifesto</span>
          <p className="mt-6 font-display text-3xl leading-snug text-lilas-800 sm:text-4xl">
            Não falamos sobre comunidade.<br />
            <span className="text-lilas-500">Sustentamos uma.</span>
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-tinta/80">
            Voz Inata nasce do desejo de reconectar mulheres à sua própria fonte —
            a verdade que não se ensina, mas se lembra. Espaço vivo, ponte entre mundos:
            aprendizado e prática, rede e negócio, presença e movimento.
          </p>
        </div>
      </section>

      {/* PILARES */}
      <section id="pilares" className="relative bg-lilas-50/70 py-24">
        <div className="container-wide">
          <span className="kicker">territórios vivos</span>
          <h2 className="mt-3 font-display text-3xl text-lilas-800 sm:text-4xl">
            Quatro pilares.<br /> Um só lugar.
          </h2>
          <p className="mt-4 max-w-2xl text-tinta/80">
            Voz Inata combina o que estava espalhado em mil grupos: aprendizado,
            encontro, convivência e visibilidade — curado, com tom e ritmo.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(p => (
              <div
                key={p.title}
                className="surface-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-menta text-xl text-lilas-800">
                  {p.icon}
                </span>
                <h3 className="mt-5 font-display text-xl text-lilas-800 title-spaced">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-tinta/80">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEMANA */}
      <section id="semana" className="relative overflow-hidden py-24">
        <div className="orb left-[-10%] bottom-[-15%] h-[420px] w-[420px] hidden md:block" />
        <div className="container-wide relative">
          <span className="kicker">ritmo de comunidade</span>
          <h2 className="mt-3 font-display text-3xl text-lilas-800 sm:text-4xl">
            Uma semana na Voz Inata.
          </h2>
          <p className="mt-4 max-w-2xl text-tinta/80">
            A comunidade respira no tempo. Cada dia traz um ritual com propósito —
            você sabe o que esperar e o que entregar.
          </p>
          <ol className="mt-12 grid gap-4 md:grid-cols-7">
            {week.map(w => (
              <li
                key={w.day}
                className="rounded-2xl border border-lilas-100 bg-white p-5 text-center shadow-sm transition hover:border-lilas-300"
              >
                <p className="font-display text-2xl text-lilas-500 title-spaced">{w.day}</p>
                <p className="mt-2 text-[11px] leading-relaxed text-argila">{w.ritual}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="border-y border-lilas-100 bg-areia/70 py-24">
        <div className="container-wide">
          <span className="kicker">três jeitos de fazer parte</span>
          <h2 className="mt-3 font-display text-3xl text-lilas-800 sm:text-4xl">
            Escolha por onde começar.
          </h2>
          <p className="mt-4 max-w-2xl text-tinta/80">
            Comece pelo plano que faz sentido pra você hoje. Pode subir ou descer quando quiser.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map(plan => (
              <div
                key={plan.name}
                className={
                  "rounded-2xl border bg-white p-7 transition " +
                  (plan.highlighted
                    ? "border-lilas-500 shadow-xl ring-2 ring-lilas-300/50"
                    : "border-lilas-100 hover:border-lilas-300")
                }
              >
                <p className="kicker">{plan.role}</p>
                <h3 className="mt-3 font-display text-3xl text-lilas-800 title-spaced">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-xs text-argila">R$</span>
                  <span className="font-display text-5xl text-lilas-700">{plan.price}</span>
                  <span className="text-sm text-argila">/mês</span>
                </div>
                <p className="text-xs text-argila">{plan.yearly}</p>
                <ul className="mt-6 space-y-2 text-sm text-tinta/85">
                  {plan.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-menta" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link href="/cadastro" className="mt-7 block">
                  <Button
                    variant={plan.highlighted ? "primary" : "outline"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-argila">
            Pause até 60 dias por ano. Cancele quando quiser, sem multa.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="container-tight">
          <span className="kicker">perguntas frequentes</span>
          <h2 className="mt-3 font-display text-3xl text-lilas-800 sm:text-4xl">
            Antes de entrar.
          </h2>
          <div className="mt-10 space-y-3">
            {faqs.map(f => (
              <details
                key={f.q}
                className="group rounded-2xl border border-lilas-100 bg-white p-5 transition hover:border-lilas-300"
              >
                <summary className="cursor-pointer list-none text-base font-medium text-lilas-800 marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="text-lilas-500 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-tinta/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-lilas-800 py-24 text-creme">
        <div className="orb right-[-6%] top-[-30%] h-[480px] w-[480px] opacity-30" />
        <div className="orb left-[-8%] bottom-[-40%] h-[380px] w-[380px] opacity-25" />
        <div className="container-tight relative text-center">
          <span className="kicker text-lavanda">e mais um tanto…</span>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Você está a um clique<br />de fazer parte.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-creme/80">
            Vagas fundadoras com preço travado vitalício — enquanto durarem.
          </p>
          <Link href="/cadastro" className="mt-10 inline-block">
            <Button size="lg" className="bg-menta-400 text-lilas-900 hover:bg-menta">
              Quero fazer parte
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

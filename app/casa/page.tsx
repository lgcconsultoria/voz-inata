import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { AppShell } from "@/components/layout/app-shell"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata = { title: "Casa" }

const PLAN_LABEL: Record<string, string> = {
  voz: "Voz",
  inata: "Inata",
  mentora: "Mentora"
}

const onboardingStepsBase = [
  { key: "account",    label: "Conta criada" },
  { key: "profile",    label: "Perfil completo" },
  { key: "first_post", label: "Primeira apresentação no mural" },
  { key: "first_rsvp", label: "Participar do primeiro evento" }
]

const featuredCards = [
  {
    tag: "Quinta do Palco",
    title: "Camila Andrade · Precificar sem culpa",
    description:
      "Como construir uma tabela de preços que reflita o valor do seu trabalho — sem pedir desculpa.",
    when: "22 mai · 20h",
    cta: "Quero participar"
  },
  {
    tag: "Nova aula",
    title: "Marca pessoal feminina",
    description:
      "5 vídeos curtos sobre posicionamento sem virar caricatura. Inclui templates de bio e roteiros.",
    when: "Disponível agora",
    cta: "Assistir"
  },
  {
    tag: "Negócio em Evidência",
    title: "Atelier Raiz · moda autoral",
    description:
      "Camila Borba criou uma marca de moda autoral feita por mulheres no interior de SP.",
    when: "Esta semana",
    cta: "Conhecer"
  }
]

const intentionPosts = [
  { name: "Marina, 34, BH", text: "Minha intenção é precificar com mais segurança esta semana." },
  { name: "Júlia, 41, SP", text: "Vou postar o primeiro carrossel novo da marca. Pra valer." },
  { name: "Ana, 29, Recife", text: "Buscar uma sócia para o programa que estou desenhando." }
]

export default async function HomePage() {
  const supabase = createSupabaseServerClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, current_plan, onboarding_state, avatar_url, bio, city")
    .eq("id", user!.id)
    .single()

  const fullName = profile?.full_name ?? "Membra"
  const firstName = fullName.split(" ")[0]
  const initial = firstName[0]?.toUpperCase() ?? "M"
  const plan = profile?.current_plan ?? "voz"
  const planLabel = PLAN_LABEL[plan] ?? "Voz"

  // Estado de onboarding derivado do banco
  const profileCompleted = !!(profile?.avatar_url && profile?.bio && profile?.city)
  const onboardingSteps = [
    { done: true, label: onboardingStepsBase[0].label },
    { done: profileCompleted, label: onboardingStepsBase[1].label },
    { done: false, label: onboardingStepsBase[2].label },
    { done: false, label: onboardingStepsBase[3].label }
  ]

  return (
    <AppShell current="/casa" userInitial={initial}>
      <div className="container-wide grid gap-8 py-10 lg:grid-cols-12">
        {/* COLUNA CENTRAL */}
        <section className="space-y-8 lg:col-span-8">
          {/* SAUDAÇÃO */}
          <div>
            <h1 className="font-display text-3xl text-verde sm:text-4xl">
              Olá, {firstName} 🌸
            </h1>
            <p className="mt-2 text-tinta/85">
              Sua semana começa hoje — Segunda da Intenção às 10h. Plano:{" "}
              <span className="font-medium text-terracota">{planLabel}</span>.
            </p>
          </div>

          {/* TRILHA DE ONBOARDING */}
          <Card>
            <p className="text-xs font-medium uppercase tracking-wider text-terracota">
              Sua jornada
            </p>
            <CardTitle className="mt-2">Você está nos primeiros dias</CardTitle>
            <p className="mt-2 text-sm text-argila">
              Complete as 4 etapas para ganhar o selo "Voz Inata Ativa".
            </p>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {onboardingSteps.map(step => (
                <li
                  key={step.label}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
                    step.done
                      ? "border-salvia/60 bg-salvia/10 text-verde"
                      : "border-areia bg-creme text-tinta"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      step.done ? "bg-salvia text-verde-800" : "bg-areia text-argila"
                    }`}
                  >
                    {step.done ? "✓" : "○"}
                  </span>
                  {step.label}
                </li>
              ))}
            </ul>
          </Card>

          {/* PRÓXIMO EVENTO */}
          <Card className="overflow-hidden border-terracota/30 bg-gradient-to-br from-white to-terracota/10">
            <p className="text-xs font-medium uppercase tracking-wider text-terracota">
              Próximo evento ao vivo
            </p>
            <CardTitle className="mt-2">Quinta do Palco · Camila Andrade</CardTitle>
            <p className="mt-2 text-sm text-tinta">
              <strong>Precificar sem culpa</strong> — como montar uma tabela de preços que reflita o valor do seu trabalho.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-argila">📅 22 mai · 20h–21h (Brasília)</p>
              <Link href="/agenda"><Button size="md">Quero participar</Button></Link>
            </div>
          </Card>

          {/* DESTAQUES DA SEMANA */}
          <div>
            <h2 className="font-display text-2xl text-verde">Destaques da semana</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {featuredCards.map(card => (
                <Card key={card.title} className="flex flex-col">
                  <span className="text-xs font-medium uppercase tracking-wider text-terracota">
                    {card.tag}
                  </span>
                  <CardTitle className="mt-2 text-lg">{card.title}</CardTitle>
                  <CardContent className="mt-2 flex-1 text-argila">
                    {card.description}
                  </CardContent>
                  <div className="mt-5 flex items-center justify-between gap-2 text-sm">
                    <span className="text-argila">{card.when}</span>
                    <Button size="sm" variant="ghost">
                      {card.cta} →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* COLUNA LATERAL */}
        <aside className="space-y-6 lg:col-span-4">
          {/* SEGUNDA DA INTENÇÃO */}
          <Card className="bg-areia/40">
            <p className="text-xs font-medium uppercase tracking-wider text-terracota">
              Segunda da Intenção
            </p>
            <CardTitle className="mt-2 text-xl">Qual sua intenção para esta semana?</CardTitle>
            <p className="mt-2 text-xs text-argila">
              Responda em 1 frase. Sem precisar virar meta.
            </p>
            <textarea
              className="mt-4 h-24 w-full rounded-lg border border-areia bg-white p-3 text-sm placeholder:text-argila/70 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/30"
              placeholder="Esta semana eu quero..."
            />
            <Button size="sm" className="mt-3 w-full">
              Publicar minha intenção
            </Button>

            <p className="mt-6 text-xs font-medium uppercase tracking-wider text-argila">
              Algumas respostas
            </p>
            <ul className="mt-3 space-y-3 text-sm">
              {intentionPosts.map(p => (
                <li key={p.name} className="rounded-lg bg-white p-3">
                  <p className="text-tinta">{p.text}</p>
                  <p className="mt-1 text-xs text-argila">— {p.name}</p>
                </li>
              ))}
            </ul>
          </Card>

          {/* MENSAGEM DA FUNDADORA */}
          <Card className="bg-verde text-creme">
            <p className="text-xs font-medium uppercase tracking-wider text-terracota-200">
              Da fundadora
            </p>
            <p className="mt-3 font-display text-lg leading-snug">
              "Esta semana eu quero ver o catálogo se mexer. Indica uma mulher daqui."
            </p>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}

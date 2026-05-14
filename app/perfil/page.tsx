import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export const metadata = { title: "Perfil" }

const badges = [
  { code: "recem", label: "🌱 Recém-chegada", earned: true },
  { code: "ativa", label: "✋ Ativa", earned: true },
  { code: "conectora", label: "🤝 Conectora", earned: false },
  { code: "palco", label: "🎤 Palco", earned: false },
  { code: "parceira", label: "💎 Parceira", earned: false }
]

const monthStats = [
  { label: "Eventos assistidos", value: "3 / 4" },
  { label: "Posts publicados", value: "5" },
  { label: "Comentários recebidos", value: "28" },
  { label: "Visitas no seu negócio", value: "47" }
]

export default function ProfilePage() {
  return (
    <AppShell current="/perfil">
      <div className="container-wide grid gap-8 py-10 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          {/* CABEÇALHO */}
          <Card className="flex flex-col gap-6 md:flex-row md:items-center">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-terracota text-3xl font-medium text-white">
              M
            </span>
            <div className="flex-1">
              <h1 className="font-display text-3xl text-verde">Marina Oliveira</h1>
              <p className="mt-1 text-sm text-argila">Belo Horizonte/MG · Membra desde mai/2026</p>
              <p className="mt-3 text-sm text-tinta">
                Plano <strong className="text-terracota">Inata</strong> · próxima cobrança em 14/jun
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <Button size="sm" variant="outline">Editar perfil</Button>
              <Button size="sm" variant="ghost">Gerenciar assinatura</Button>
            </div>
          </Card>

          {/* SELOS */}
          <Card>
            <CardTitle>Selos & Conquistas</CardTitle>
            <CardContent className="mt-2 text-argila">
              Conquistas visíveis para a comunidade. Mostram sua trajetória aqui dentro.
            </CardContent>
            <ul className="mt-5 flex flex-wrap gap-3">
              {badges.map(b => (
                <li
                  key={b.code}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    b.earned
                      ? "border-salvia bg-salvia/10 text-verde"
                      : "border-areia bg-creme text-argila"
                  }`}
                >
                  {b.label}
                </li>
              ))}
            </ul>
          </Card>

          {/* SEU MÊS EM NÚMEROS */}
          <Card className="bg-areia/40">
            <p className="text-xs font-medium uppercase tracking-wider text-terracota">
              Seu mês em números
            </p>
            <CardTitle className="mt-2">Você está usando o que assina</CardTitle>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              {monthStats.map(s => (
                <div key={s.label} className="rounded-xl bg-white p-4">
                  <p className="font-display text-2xl text-verde">{s.value}</p>
                  <p className="mt-1 text-xs text-argila">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="space-y-4 lg:col-span-4">
          <Card>
            <CardTitle className="text-lg">Minha Assinatura</CardTitle>
            <ul className="mt-3 space-y-2 text-sm text-tinta">
              <li><strong>Plano:</strong> Inata</li>
              <li><strong>Cobrança:</strong> R$ 89/mês</li>
              <li><strong>Próxima:</strong> 14/jun/2026</li>
              <li><strong>Status:</strong> ✅ Ativa</li>
            </ul>
            <div className="mt-5 flex flex-col gap-2">
              <Button size="sm" variant="outline">Trocar de plano</Button>
              <Button size="sm" variant="ghost">Pausar até 60 dias</Button>
              <button className="mt-2 text-xs text-argila underline-offset-2 hover:underline">
                Cancelar minha assinatura
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}

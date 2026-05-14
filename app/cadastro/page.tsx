import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input, Label } from "@/components/ui/input"

export const metadata = { title: "Cadastro" }

const plans = [
  { id: "voz", name: "Voz", price: 49, founder: 39, role: "Para começar" },
  { id: "inata", name: "Inata", price: 89, founder: 69, role: "Plano âncora", default: true },
  { id: "mentora", name: "Mentora", price: 249, founder: 199, role: "Vagas limitadas" }
]

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-creme py-12">
      <div className="container-tight">
        <Link
          href="/"
          className="mb-8 inline-block font-display text-2xl font-semibold text-verde hover:text-terracota"
        >
          Voz Inata
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* FORMULÁRIO */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <h1 className="font-display text-2xl text-verde">Bem-vinda à Voz Inata</h1>
              <p className="mt-2 text-sm text-argila">
                4 passos rápidos. Você está a poucos minutos de fazer parte.
              </p>

              <form className="mt-6 space-y-8" action="/casa">
                {/* Passo 1 — Plano */}
                <section>
                  <p className="text-xs font-medium uppercase tracking-wider text-terracota">
                    Passo 1 — Escolha seu plano
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {plans.map(p => (
                      <label
                        key={p.id}
                        className={`flex cursor-pointer flex-col rounded-xl border p-4 transition hover:border-terracota ${
                          p.default ? "border-terracota bg-terracota/5" : "border-areia bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={p.id}
                          defaultChecked={p.default}
                          className="sr-only"
                        />
                        <span className="text-xs text-argila">{p.role}</span>
                        <span className="mt-1 font-display text-xl text-verde">{p.name}</span>
                        <span className="mt-2 text-sm text-tinta">
                          R$ {p.price}
                          <span className="text-xs text-argila">/mês</span>
                        </span>
                        <span className="mt-1 text-[11px] text-terracota">
                          Fundadora: R$ {p.founder} vitalício
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Passo 2 — Dados */}
                <section>
                  <p className="text-xs font-medium uppercase tracking-wider text-terracota">
                    Passo 2 — Seus dados
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input id="name" name="name" placeholder="Seu nome" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input id="phone" name="phone" placeholder="(11) 99999-0000" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" name="city" placeholder="Sua cidade" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" name="state" placeholder="UF" maxLength={2} required />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="password">Crie uma senha</Label>
                      <Input id="password" name="password" type="password" placeholder="Mínimo 8 caracteres" minLength={8} required />
                    </div>
                  </div>
                </section>

                {/* Passo 3 — Pagamento (placeholder) */}
                <section>
                  <p className="text-xs font-medium uppercase tracking-wider text-terracota">
                    Passo 3 — Pagamento
                  </p>
                  <div className="mt-3 rounded-xl border border-dashed border-areia bg-areia/30 p-6 text-center text-sm text-argila">
                    <p>Integração Stripe (cartão recorrente + Pix) entra na próxima etapa.</p>
                    <p className="mt-2 text-xs">Por enquanto, este é um esqueleto navegável.</p>
                  </div>
                </section>

                {/* Passo 4 — Termos */}
                <section>
                  <p className="text-xs font-medium uppercase tracking-wider text-terracota">
                    Passo 4 — Acordo
                  </p>
                  <label className="mt-3 flex items-start gap-3 text-sm text-tinta">
                    <input type="checkbox" required className="mt-1 h-4 w-4 accent-terracota" />
                    <span>
                      Li e aceito os{" "}
                      <a href="#" className="text-verde underline-offset-2 hover:underline">Termos de Uso</a>
                      , a{" "}
                      <a href="#" className="text-verde underline-offset-2 hover:underline">Política de Privacidade</a>{" "}
                      e as{" "}
                      <a href="#" className="text-verde underline-offset-2 hover:underline">Regras de Convivência</a>{" "}
                      da Voz Inata.
                    </span>
                  </label>
                </section>

                <Button type="submit" size="lg" className="w-full">
                  Confirmar e entrar na comunidade
                </Button>

                <p className="text-center text-xs text-argila">
                  Já é membra?{" "}
                  <Link href="/entrar" className="text-verde underline-offset-2 hover:underline">
                    Entrar
                  </Link>
                </p>
              </form>
            </Card>
          </div>

          {/* RESUMO LATERAL */}
          <aside>
            <Card className="sticky top-8 bg-areia/40">
              <p className="text-xs font-medium uppercase tracking-wider text-terracota">Resumo</p>
              <p className="mt-3 font-display text-2xl text-verde">Plano Inata</p>
              <p className="mt-1 text-sm text-tinta">R$ 89/mês</p>
              <p className="mt-1 text-xs text-terracota">
                R$ 69/mês vitalício se você está nas 100 Fundadoras
              </p>
              <hr className="my-5 border-areia" />
              <ul className="space-y-2 text-sm text-tinta">
                <li>✓ Mural, biblioteca e agenda completos</li>
                <li>✓ Espaço próprio no Catálogo</li>
                <li>✓ Todos os eventos ao vivo</li>
                <li>✓ Quarta do Negócio + Círculos</li>
              </ul>
              <hr className="my-5 border-areia" />
              <p className="text-xs text-argila">
                Pause até 60 dias por ano. Cancele quando quiser, sem multa.
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

"use client"

import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input, Label } from "@/components/ui/input"
import { signUpAction, type AuthState } from "@/app/(auth)/actions"

const plans = [
  { id: "voz",     name: "Voz",     price: 49,  founder: 39,  role: "Para começar" },
  { id: "inata",   name: "Inata",   price: 89,  founder: 69,  role: "Plano âncora", default: true },
  { id: "mentora", name: "Mentora", price: 249, founder: 199, role: "Vagas limitadas" }
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Criando sua conta..." : "Confirmar e entrar na comunidade"}
    </Button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(signUpAction, {})

  return (
    <main className="relative min-h-screen overflow-hidden bg-creme py-12">
      <div className="orb right-[-12%] top-[5%] h-[420px] w-[420px] hidden md:block animate-orb-float" />
      <div className="container-tight relative">
        <Link
          href="/"
          className="mb-8 inline-flex flex-col items-start group"
        >
          <span className="font-display text-2xl font-extrabold tracking-tight text-lilas-800 group-hover:text-lilas-600">
            voz<span className="text-menta-400">·</span>inata
          </span>
          <span className="text-[10px] uppercase tracking-brand text-lilas-500">
            conexão · presença · alma
          </span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <span className="kicker">bem-vinda à voz inata</span>
              <h1 className="mt-2 font-display text-2xl text-lilas-800">Você está chegando.</h1>
              <p className="mt-2 text-sm text-argila">
                Você está a poucos minutos de fazer parte. No MVP esqueleto, ainda sem cobrança —
                o Stripe entra na próxima fase.
              </p>

              <form action={formAction} className="mt-6 space-y-8">
                {/* Passo 1 — Plano */}
                <section>
                  <p className="kicker">passo 1 — escolha seu plano</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {plans.map(p => (
                      <label
                        key={p.id}
                        className="flex cursor-pointer flex-col rounded-2xl border border-lilas-100 bg-white p-4 transition hover:border-lilas-300 has-[:checked]:border-lilas-500 has-[:checked]:bg-lilas-50"
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={p.id}
                          defaultChecked={p.default}
                          className="sr-only"
                        />
                        <span className="text-xs text-argila">{p.role}</span>
                        <span className="mt-1 font-display text-xl font-extrabold text-lilas-800 title-spaced">{p.name}</span>
                        <span className="mt-2 text-sm text-tinta">
                          R$ {p.price}
                          <span className="text-xs text-argila">/mês</span>
                        </span>
                        <span className="mt-1 text-[11px] text-lilas-600">
                          Fundadora: R$ {p.founder} vitalício
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Passo 2 — Dados */}
                <section>
                  <p className="kicker">passo 2 — seus dados</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                      <Input id="phone" name="phone" placeholder="(11) 99999-0000" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" name="city" placeholder="Sua cidade" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" name="state" placeholder="UF" maxLength={2} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="password">Crie uma senha</Label>
                      <Input id="password" name="password" type="password" placeholder="Mínimo 8 caracteres" minLength={8} required />
                    </div>
                  </div>
                </section>

                {/* Passo 3 — Termos */}
                <section>
                  <p className="kicker">passo 3 — acordo</p>
                  <label className="mt-4 flex items-start gap-3 text-sm text-tinta">
                    <input type="checkbox" required className="mt-1 h-4 w-4 accent-lilas-500" />
                    <span>
                      Li e aceito os{" "}
                      <a href="#" className="text-lilas-700 font-medium underline-offset-2 hover:underline">Termos de Uso</a>
                      , a{" "}
                      <a href="#" className="text-lilas-700 font-medium underline-offset-2 hover:underline">Política de Privacidade</a>{" "}
                      e as{" "}
                      <a href="#" className="text-lilas-700 font-medium underline-offset-2 hover:underline">Regras de Convivência</a>{" "}
                      da Voz Inata.
                    </span>
                  </label>
                </section>

                {state.error && (
                  <p className="rounded-lg border border-vinho/30 bg-vinho/10 px-3 py-2 text-sm text-vinho">
                    {state.error}
                  </p>
                )}

                <SubmitButton />

                <p className="text-center text-xs text-argila">
                  Já é membra?{" "}
                  <Link href="/entrar" className="text-lilas-700 font-medium underline-offset-2 hover:underline">
                    Entrar
                  </Link>
                </p>
              </form>
            </Card>
          </div>

          <aside>
            <Card className="sticky top-8 bg-lilas-50">
              <p className="kicker">resumo</p>
              <p className="mt-3 font-display text-2xl font-extrabold text-lilas-800 title-spaced">Plano selecionado</p>
              <p className="mt-1 text-sm text-tinta">Você pode trocar no perfil depois.</p>
              <hr className="my-5 border-lilas-100" />
              <ul className="space-y-2 text-sm text-tinta">
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-menta" /> Sem cobrança no MVP esqueleto</li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-menta" /> Acesso completo às telas</li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-menta" /> Stripe entra na próxima fase</li>
              </ul>
              <hr className="my-5 border-lilas-100" />
              <p className="text-xs text-argila">
                Pause até 60 dias por ano. Cancele quando quiser, sem multa.
              </p>
              <p className="mt-4 font-script text-lg text-lilas-500">e mais um tanto…</p>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

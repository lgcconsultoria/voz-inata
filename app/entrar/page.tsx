"use client"

import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input, Label } from "@/components/ui/input"
import { signInAction, type AuthState } from "@/app/(auth)/actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(signInAction, {})

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-creme px-4 py-12">
      <div className="orb left-[-10%] top-[10%] h-[420px] w-[420px] hidden md:block animate-orb-float" />
      <div className="orb right-[-8%] bottom-[5%] h-[340px] w-[340px] hidden md:block opacity-40" />
      <div className="relative w-full max-w-md">
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
        <Card className="bg-white">
          <span className="kicker">bem-vinda de volta</span>
          <h1 className="mt-2 font-display text-2xl text-lilas-800">Entrar.</h1>
          <p className="mt-2 text-sm text-argila">
            Entre com seu e-mail e senha para acessar a comunidade.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="/esqueci-senha"
                  className="text-xs text-terracota hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
            </div>

            {state.error && (
              <p className="rounded-lg border border-vinho/30 bg-vinho/10 px-3 py-2 text-sm text-vinho">
                {state.error}
              </p>
            )}

            <SubmitButton />
          </form>

          <p className="mt-8 text-center text-sm text-argila">
            Ainda não é membra?{" "}
            <Link href="/cadastro" className="text-lilas-700 font-medium underline-offset-2 hover:underline">
              Quero entrar
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}

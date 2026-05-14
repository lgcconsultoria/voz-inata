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
    <main className="flex min-h-screen items-center justify-center bg-creme px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-block font-display text-2xl font-semibold text-verde hover:text-terracota"
        >
          Voz Inata
        </Link>
        <Card className="bg-white">
          <h1 className="font-display text-2xl text-verde">Bem-vinda de volta</h1>
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
            <Link href="/cadastro" className="text-verde underline-offset-2 hover:underline">
              Quero entrar
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}

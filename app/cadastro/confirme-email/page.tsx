import Link from "next/link"
import { Card } from "@/components/ui/card"

export const metadata = { title: "Confirme seu e-mail" }

export default function ConfirmEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-creme px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-block font-display text-2xl font-semibold text-verde hover:text-terracota"
        >
          Voz Inata
        </Link>
        <Card className="bg-white text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-terracota/15 text-2xl">
            ✉️
          </span>
          <h1 className="mt-4 font-display text-2xl text-verde">
            Confirme seu e-mail
          </h1>
          <p className="mt-3 text-sm text-tinta">
            Enviamos um link de confirmação para o e-mail que você cadastrou.
            Clica no link e você entra direto na comunidade.
          </p>
          <p className="mt-4 text-xs text-argila">
            Não chegou em alguns minutos? Veja a caixa de spam ou{" "}
            <Link href="/entrar" className="text-verde underline-offset-2 hover:underline">
              tente entrar
            </Link>
            .
          </p>
        </Card>
      </div>
    </main>
  )
}

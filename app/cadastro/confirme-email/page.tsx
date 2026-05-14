import Link from "next/link"
import { Card } from "@/components/ui/card"

export const metadata = { title: "Confirme seu e-mail" }

export default function ConfirmEmailPage() {
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
        <Card className="bg-white text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-menta/30 text-2xl text-lilas-800">
            ✦
          </span>
          <span className="mt-4 inline-block kicker">quase lá</span>
          <h1 className="mt-2 font-display text-2xl text-lilas-800">
            Confirme seu e-mail.
          </h1>
          <p className="mt-3 text-sm text-tinta">
            Enviamos um link de confirmação para o e-mail que você cadastrou.
            Clica no link e você entra direto na comunidade.
          </p>
          <p className="mt-4 text-xs text-argila">
            Não chegou em alguns minutos? Veja a caixa de spam ou{" "}
            <Link href="/entrar" className="text-lilas-700 font-medium underline-offset-2 hover:underline">
              tente entrar
            </Link>
            .
          </p>
        </Card>
      </div>
    </main>
  )
}

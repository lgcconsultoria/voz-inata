import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input, Label } from "@/components/ui/input"

export const metadata = { title: "Entrar" }

export default function LoginPage() {
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

          <form className="mt-6 space-y-4" action="/casa">
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
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-xs text-argila">
            <span className="h-px flex-1 bg-areia" />
            ou continue com
            <span className="h-px flex-1 bg-areia" />
          </div>

          <Button variant="outline" className="mt-4 w-full">
            Continuar com Google
          </Button>

          <p className="mt-8 text-center text-sm text-argila">
            Ainda não é membra?{" "}
            <Link href="/cadastro" className="text-verde underline-offset-2 hover:underline">
              Quero entrar
            </Link>
          </p>
        </Card>

        <p className="mt-6 text-center text-xs text-argila">
          Este é um esqueleto do MVP. A integração com Supabase Auth entra na próxima etapa.
        </p>
      </div>
    </main>
  )
}

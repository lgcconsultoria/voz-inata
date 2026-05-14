import type { Metadata } from "next"
import { Inter, Fraunces } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: {
    default: "Voz Inata — Sua voz nasceu pra ter rede",
    template: "%s · Voz Inata"
  },
  description:
    "A comunidade digital onde mulheres crescem em rede: aprendizado, agenda viva de eventos, mural curado e catálogo de negócios — em um só lugar.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Voz Inata",
    description:
      "A comunidade digital onde mulheres crescem em rede. Aprendizado, agenda viva, mural curado e catálogo de negócios — em um só lugar.",
    type: "website",
    locale: "pt_BR"
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  )
}

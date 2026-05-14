import type { Metadata } from "next"
import { Inter, Manrope, Caveat } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: {
    default: "Voz Inata — conexão, presença e alma",
    template: "%s · Voz Inata"
  },
  description:
    "Voz Inata · uma comunidade onde mulheres crescem em rede. Aprendizado, agenda viva, mural curado e catálogo de negócios — em um só lugar.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Voz Inata · conexão, presença e alma",
    description:
      "Uma comunidade onde mulheres crescem em rede — aprendizado, agenda viva, mural curado e catálogo de negócios.",
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
    <html
      lang="pt-BR"
      className={`${inter.variable} ${manrope.variable} ${caveat.variable}`}
    >
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  )
}

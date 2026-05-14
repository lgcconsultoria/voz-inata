import { NextResponse } from "next/server"
import { signOutAction } from "@/app/(auth)/actions"

export async function GET() {
  await signOutAction()
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"))
}

export async function POST() {
  return GET()
}

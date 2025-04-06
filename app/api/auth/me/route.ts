import { getSession } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json(null, { status: 401 })
    }
    return NextResponse.json(session.user)
  } catch (error) {
    console.error("Error al obtener la sesión:", error)
    return NextResponse.json({ error: "Error al obtener la sesión" }, { status: 500 })
  }
}


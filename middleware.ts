import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Verificar si el usuario está autenticado
  const authCookie = request.cookies.get("appSession")

  // Si no hay cookie de sesión y la ruta es protegida, redirigir a login
  if (!authCookie && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}


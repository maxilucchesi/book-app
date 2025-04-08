import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Verificar si el usuario está autenticado con Supabase
  const hasSupabaseCookies = request.cookies.has("sb-access-token") || request.cookies.has("sb-refresh-token")

  // Si no hay cookies de Supabase y la ruta es protegida, redirigir a login
  if (!hasSupabaseCookies && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}

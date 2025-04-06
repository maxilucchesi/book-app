export const auth0Config = {
  baseURL: process.env.AUTH0_BASE_URL || "https://mislecturas.vercel.app",
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  routes: {
    callback: "/api/auth/callback",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
  session: {
    rollingDuration: 60 * 60 * 24, // 24 horas
    absoluteDuration: 60 * 60 * 24 * 7, // 7 días
  },
  cookies: {
    // Configuración específica para producción
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
  },
}


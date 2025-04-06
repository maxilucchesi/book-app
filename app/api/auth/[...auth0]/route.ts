import { handleAuth } from "@auth0/nextjs-auth0"

// Especificar el runtime de Node.js
export const runtime = "nodejs"

// Función para manejar todas las rutas de autenticación
export const GET = handleAuth()
export const POST = handleAuth()


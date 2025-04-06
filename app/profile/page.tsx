import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Función para verificar si el usuario está autenticado
async function isAuthenticated() {
  const cookieStore = cookies()
  return cookieStore.has("appSession")
}

export default async function ProfilePage() {
  // Verificar si el usuario está autenticado
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect("/")
  }

  return (
    <div className="container min-h-screen flex flex-col justify-center items-center p-4">
      <main className="flex-1 flex flex-col justify-center items-center py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Perfil de Usuario</h1>

        <div className="border rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold mb-4">Información del usuario</h2>
          <p className="mb-4">Has iniciado sesión correctamente.</p>

          <div className="flex gap-4">
            <Link
              href="/"
              className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90"
            >
              Volver al inicio
            </Link>
            <Link
              href="/api/auth/logout"
              className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Cerrar sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


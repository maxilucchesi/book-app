import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSession } from "@auth0/nextjs-auth0"

export default async function DashboardPage() {
  // Verificar si el usuario está autenticado
  const cookieStore = cookies()
  const session = await getSession()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mi Biblioteca</h1>
        <div className="flex items-center gap-4">
          <span>{session.user.name}</span>
          <Link
            href="/api/auth/logout"
            className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Cerrar sesión
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mi Biblioteca</h2>
          <p className="mb-4">Gestiona tus libros y su estado de lectura.</p>
          <Link href="/dashboard/add" className="text-primary hover:underline">
            Añadir libro
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mi Wishlist</h2>
          <p className="mb-4">Libros que quieres leer en el futuro.</p>
          <Link href="/dashboard/wishlist" className="text-primary hover:underline">
            Ver wishlist
          </Link>
        </div>
      </div>
    </div>
  )
}


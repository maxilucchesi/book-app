import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Link from "next/link"

export default withPageAuthRequired(function ProfilePage({ user }) {
  return (
    <div className="container min-h-screen flex flex-col justify-center items-center p-4">
      <main className="flex-1 flex flex-col justify-center items-center py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Perfil de Usuario</h1>

        <div className="border rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold mb-4">Información del usuario</h2>
          {user && (
            <div className="mb-4">
              {user.picture && (
                <img
                  src={user.picture || "/placeholder.svg"}
                  alt={user.name || "Usuario"}
                  width={100}
                  height={100}
                  className="rounded-full mb-4"
                />
              )}
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p>{user.email}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link href="/">
              <a className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90">
                Volver al inicio
              </a>
            </Link>
            <Link href="/api/auth/logout">
              <a className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Cerrar sesión
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
})


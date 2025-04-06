import Link from "next/link"
import { AuthStatus } from "@/components/auth-client"

export default function Home() {
  return (
    <div className="container min-h-screen flex flex-col justify-center items-center p-4">
      <header className="w-full py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mi Biblioteca</h1>
        <AuthStatus />
      </header>

      <main className="flex-1 flex flex-col justify-center items-center py-20">
        <h2 className="text-4xl font-bold text-center mb-8">
          Bienvenido a <span className="text-primary">Mi Biblioteca Personal</span>
        </h2>

        <div className="grid gap-6 mt-12">
          <div className="border rounded-lg p-6 text-left">
            <h3 className="text-xl font-semibold mb-4">Gestiona tus libros</h3>
            <p className="mb-4">Inicia sesión para acceder a tu biblioteca personal y lista de deseos.</p>
            <Link
              href="/dashboard"
              className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Ir al Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


import { LoginForm } from "./login-form"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"

export default async function LoginPage() {
  // Redirigir si el usuario ya está autenticado
  const user = await getUser()
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="container min-h-screen flex flex-col justify-center items-center p-4">
      <main className="flex-1 flex flex-col justify-center items-center py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Mi Biblioteca</h1>
        <div className="w-full max-w-md border rounded-lg p-6">
          <LoginForm />
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

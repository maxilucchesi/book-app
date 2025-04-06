import { LoginButton } from "@/components/auth-client"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="container min-h-screen flex flex-col justify-center items-center p-4">
      <main className="flex-1 flex flex-col justify-center items-center py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Iniciar sesión</h1>

        <div className="border rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold mb-4">Elige un método de inicio de sesión</h2>

          <div className="flex flex-col gap-4">
            <LoginButton />

            <div className="mt-4 text-sm">
              <p>Si continúas teniendo problemas, puedes intentar:</p>
              <Link href="/api/auth/login" className="text-primary hover:underline">
                Iniciar sesión directamente
              </Link>
            </div>

            <Link
              href="/"
              className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 text-center mt-4"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


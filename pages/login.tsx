import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="container min-h-screen flex flex-col justify-center items-center p-4">
      <main className="flex-1 flex flex-col justify-center items-center py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Iniciar sesión</h1>

        <div className="border rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold mb-4">Elige un método de inicio de sesión</h2>

          <div className="flex flex-col gap-4">
            <Link href="/api/auth/login">
              <a className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 text-center">
                Iniciar sesión con Auth0
              </a>
            </Link>

            <Link href="/">
              <a className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 text-center">
                Volver al inicio
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


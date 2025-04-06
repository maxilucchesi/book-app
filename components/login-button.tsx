"use client"

import { useState } from "react"
import Link from "next/link"

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Usar window.location.href para la redirección
      window.location.href = "/api/auth/login"
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err)
      setError("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión con Auth0"}
      </button>

      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

      <div className="mt-4 text-sm">
        <p>Si continúas teniendo problemas, puedes intentar:</p>
        <Link href="/api/auth/login" className="text-primary hover:underline">
          Iniciar sesión directamente
        </Link>
      </div>
    </div>
  )
}


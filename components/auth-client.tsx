"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface User {
  name?: string
  email?: string
  picture?: string
}

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    return (
      <Link href="/login" className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
        Iniciar sesión
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {user.picture && (
        <img src={user.picture || "/placeholder.svg"} alt={user.name || "Usuario"} className="w-8 h-8 rounded-full" />
      )}
      <span>{user.name}</span>
      <Link href="/api/auth/logout" className="text-sm text-red-500 hover:underline">
        Cerrar sesión
      </Link>
    </div>
  )
}

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = () => {
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
    </div>
  )
}


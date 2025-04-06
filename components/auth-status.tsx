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
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
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


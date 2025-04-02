"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (pathname === "/login") return null

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-bold">
            Mi Biblioteca
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}
            >
              Mi Biblioteca
            </Link>
            <Link
              href="/dashboard/wishlist"
              className={`text-sm font-medium ${
                pathname === "/dashboard/wishlist" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Wishlist
            </Link>
          </nav>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Cerrar sesión</span>
        </Button>
      </div>
    </header>
  )
}


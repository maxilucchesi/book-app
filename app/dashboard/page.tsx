"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/book-card"
import { BookPlus, RefreshCw } from "lucide-react"
import { getBooksByType } from "@/lib/books"
import { UserNav } from "@/components/user-nav"
import { SyncStatus } from "@/components/sync-status"
import { toast } from "@/components/ui/use-toast"
import { getRandomPhrase } from "@/lib/random-phrases"

export default function DashboardPage() {
  const [recentlyRead, setRecentlyRead] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [randomPhrase, setRandomPhrase] = useState("")
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  // Cargar datos
  const loadData = async () => {
    try {
      setIsLoading(true)
      const readBooks = await getBooksByType("read")
      const wishlistBooks = await getBooksByType("wishlist")

      setRecentlyRead(readBooks)
      setWishlist(wishlistBooks)
      console.log("Dashboard data loaded:", { readBooks, wishlistBooks })
    } catch (error) {
      console.error("Error al cargar libros:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los libros. Intenta refrescar la página.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Refrescar datos manualmente
  const handleRefresh = async () => {
    setIsRefreshing(true)
    setLastRefresh(Date.now())
    // También actualizar la frase aleatoria al refrescar
    setRandomPhrase(getRandomPhrase())
    await loadData()
    setIsRefreshing(false)
  }

  // Cargar datos y establecer frase aleatoria al montar el componente
  useEffect(() => {
    // Establecer una frase aleatoria
    setRandomPhrase(getRandomPhrase())

    loadData()

    // Escuchar eventos de actualización de libros
    const handleBooksUpdated = () => {
      console.log("Books updated event detected, reloading data...")
      loadData()
    }

    window.addEventListener("booksUpdated", handleBooksUpdated)

    // Escuchar cambios en la URL (como cuando volvemos después de eliminar)
    const handleRouteChange = () => {
      console.log("Route change detected, reloading data...")
      loadData()
    }

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("booksUpdated", handleBooksUpdated)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [lastRefresh])

  // Añadir un timestamp para depuración
  const timestamp = new Date().toISOString()
  console.log(`Dashboard rendered at: ${timestamp}`)

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="font-serif text-6xl font-normal text-[#222222] tracking-tight leading-tight"
              style={{ fontSize: "64px" }}
            >
              Mis Lecturas
            </h1>
            <p className="mt-1 text-base leading-6 text-[#888888]">{randomPhrase}</p>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 h-8 w-8 rounded-full p-0"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 text-[#888888] ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refrescar</span>
            </Button>
            <UserNav />
          </div>
        </header>

        {/* Componente de estado de sincronización */}
        <SyncStatus />

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-semibold text-[#222222] tracking-tight leading-snug">Leídos</h2>
            <Link href="/books?filter=read" className="text-sm font-semibold text-[#666666] hover:text-[#FFA69E]">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-xl bg-white p-4 text-center shadow-sm animate-pulse">
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 mx-auto"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto"></div>
              </div>
            ) : recentlyRead.length > 0 ? (
              recentlyRead
                .slice(0, 3)
                .map((book) => <BookCard key={book.id || book.local_id || Date.now()} book={book} type="read" />)
            ) : (
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-[#888888]">No hay libros añadidos aún</p>
                <Link href="/add-book" className="mt-2 inline-block text-sm text-[#FFA69E] hover:underline">
                  Añade tu primer libro
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-semibold text-[#222222] tracking-tight leading-snug">Wishlist</h2>
            <Link href="/books?filter=wishlist" className="text-sm font-semibold text-[#666666] hover:text-[#FFA69E]">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-xl bg-[#F5F5F5] p-4 text-center shadow-sm animate-pulse">
                <div className="h-6 w-3/4 bg-gray-300 rounded mb-2 mx-auto"></div>
                <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto"></div>
              </div>
            ) : wishlist.length > 0 ? (
              wishlist
                .slice(0, 3)
                .map((book) => <BookCard key={book.id || book.local_id || Date.now()} book={book} type="wishlist" />)
            ) : (
              <div className="rounded-xl bg-[#F5F5F5] p-4 text-center shadow-sm">
                <p className="text-[#888888]">Tu lista de deseos está vacía</p>
                <Link
                  href="/add-book?type=wishlist"
                  className="mt-2 inline-block text-sm text-[#FFA69E] hover:underline"
                >
                  Añade libros a tu lista de deseos
                </Link>
              </div>
            )}
          </div>
        </section>

        <Link href="/add-book">
          <div
            className="fixed bottom-6 right-6 group"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <Button
              className={`h-14 w-14 rounded-full bg-[#FFA69E] p-0 shadow-md hover:bg-[#D0E2FF] transition-all duration-300 ${
                isButtonHovered ? "scale-110" : ""
              }`}
            >
              <BookPlus
                className={`h-6 w-6 text-white transition-all duration-300 ${isButtonHovered ? "rotate-12" : ""}`}
              />
              <span className="sr-only">Añadir libro</span>
            </Button>
            {isButtonHovered && (
              <span className="absolute -top-10 right-0 bg-white px-3 py-1 rounded-full text-sm shadow-md animate-fade-in">
                Añadir libro
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}

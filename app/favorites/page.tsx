"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookCard } from "@/components/book-card"
import { getBooksByType } from "@/lib/books"
import { UserNav } from "@/components/user-nav"
import { toast } from "@/components/ui/use-toast"
import { PullToRefresh } from "@/components/pull-to-refresh"

export default function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "gallery">("list")

  // Load saved view mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("giuli-view-mode")
      if (savedViewMode === "list" || savedViewMode === "gallery") {
        setViewMode(savedViewMode)
      }
    }
  }, [])

  // Handle view mode changes
  const handleViewModeChange = (mode: "list" | "gallery") => {
    setViewMode(mode)
    if (typeof window !== "undefined") {
      localStorage.setItem("giuli-view-mode", mode)
    }
  }

  // Cargar libros favoritos (rating 5)
  const loadFavoriteBooks = async () => {
    try {
      setIsLoading(true)
      const readBooks = await getBooksByType("read")
      const favorites = readBooks.filter((book) => book.rating === 5)
      setFavoriteBooks(favorites)
    } catch (error) {
      console.error("Error al cargar libros favoritos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los libros favoritos. Intenta refrescar la página.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar libros favoritos al montar el componente
  useEffect(() => {
    loadFavoriteBooks()
  }, [])

  // Manejar el refresco manual
  const handleRefresh = async () => {
    await loadFavoriteBooks()
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-texture p-6">
        <div className="mx-auto max-w-md">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-normal text-[#222222] text-[2.4rem]">Favoritos</h1>
              <div className="flex items-center">
                <UserNav viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              </div>
            </div>
            <p className="mt-1 text-sm text-[#888888]">Tus lecturas con 5 estrellas</p>
          </header>

          <div className="mt-6">
            {isLoading ? (
              viewMode === "gallery" ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-xl bg-white shadow-sm animate-pulse">
                      <div className="aspect-[1/1.545] bg-gray-200 rounded-t-lg"></div>
                      <div className="p-3">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-xl bg-white p-4 shadow-sm animate-pulse">
                      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              )
            ) : favoriteBooks.length > 0 ? (
              viewMode === "gallery" ? (
                <div className="grid grid-cols-2 gap-4">
                  {favoriteBooks.map((book) => (
                    <BookCard key={book.id || book.local_id} book={book} type="read" showActions viewMode={viewMode} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteBooks.map((book) => (
                    <BookCard key={book.id || book.local_id} book={book} type="read" showActions viewMode={viewMode} />
                  ))}
                </div>
              )
            ) : (
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-[#888888]">No tienes libros favoritos aún</p>
                <p className="text-sm text-[#888888] mt-1">
                  Los libros con calificación de 5 estrellas aparecerán aquí
                </p>
                <Link href="/books" className="mt-2 inline-block text-sm text-[#FFA69E] hover:underline">
                  Ver todos mis libros
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PullToRefresh>
  )
}

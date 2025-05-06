"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookCard } from "@/components/book-card"
import { getBooksByType } from "@/lib/books"
import { UserNav } from "@/components/user-nav"
import { BookFilter } from "@/components/book-filter"
import { toast } from "@/components/ui/use-toast"
import { PullToRefresh } from "@/components/pull-to-refresh"

export default function BooksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [books, setBooks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "read" | "wishlist">("all")
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

  // Obtener el filtro de los parámetros de búsqueda
  useEffect(() => {
    const filterParam = searchParams.filter
    if (filterParam === "read" || filterParam === "wishlist") {
      setFilter(filterParam)
    } else {
      setFilter("all")
    }
  }, [searchParams])

  // Cargar libros
  const loadBooks = async () => {
    try {
      setIsLoading(true)
      let booksData: any[] = []

      if (filter === "all") {
        const readBooks = await getBooksByType("read")
        const wishlistBooks = await getBooksByType("wishlist")
        booksData = [...readBooks, ...wishlistBooks]
      } else {
        booksData = await getBooksByType(filter)
      }

      setBooks(booksData)
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

  // Cargar libros cuando cambia el filtro
  useEffect(() => {
    loadBooks()
  }, [filter])

  // Manejar el refresco manual
  const handleRefresh = async () => {
    await loadBooks()
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-texture p-6">
        <div className="mx-auto max-w-md">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-normal text-[#222222] text-[2.4rem]">Mis Libros</h1>
              <div className="flex items-center">
                <UserNav viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              </div>
            </div>
          </header>

          <BookFilter currentFilter={filter} />

          <div className="mt-6">
            {isLoading ? (
              viewMode === "gallery" ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className={`rounded-xl ${
                        filter === "wishlist" ? "bg-[#F5F5F5]" : "bg-white"
                      } shadow-sm animate-pulse`}
                    >
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
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className={`rounded-xl ${
                        filter === "wishlist" ? "bg-[#F5F5F5]" : "bg-white"
                      } p-4 shadow-sm animate-pulse`}
                    >
                      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              )
            ) : books.length > 0 ? (
              viewMode === "gallery" ? (
                <div className="grid grid-cols-2 gap-4">
                  {books.map((book) => (
                    <BookCard
                      key={book.id || book.local_id}
                      book={book}
                      type={book.type}
                      showActions
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {books.map((book) => (
                    <BookCard
                      key={book.id || book.local_id}
                      book={book}
                      type={book.type}
                      showActions
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-[#888888]">No hay libros en esta categoría</p>
                <Link href="/add-book" className="mt-2 inline-block text-sm text-[#FFA69E] hover:underline">
                  Añadir un libro
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PullToRefresh>
  )
}

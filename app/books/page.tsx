"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/book-card"
import { ArrowLeft, PlusCircle } from "lucide-react"
import { getBooks } from "@/lib/books"
import { BookFilter } from "@/components/book-filter"
import { useState, useEffect } from "react"
import { ViewModeToggle } from "@/components/view-mode-toggle"
import { toast } from "@/components/ui/use-toast"

export default function BooksPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  // Obtener el filtro de la URL o usar "all" como valor predeterminado
  const filter = searchParams.filter || "all"

  const [books, setBooks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "gallery">("list")

  // Load books
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true)
      try {
        // Obtener todos los libros
        const allBooks = await getBooks()
        setBooks(allBooks)
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

    // Load saved view mode preference
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("giuli-view-mode")
      if (savedViewMode === "list" || savedViewMode === "gallery") {
        setViewMode(savedViewMode)
      }
    }

    loadBooks()
  }, [])

  // Handle view mode changes
  const handleViewModeChange = (mode: "list" | "gallery") => {
    setViewMode(mode)
    if (typeof window !== "undefined") {
      localStorage.setItem("giuli-view-mode", mode)
    }
  }

  // Filtrar los libros según el filtro seleccionado
  const filteredBooks = filter === "all" ? books : books.filter((book) => book.type === filter)

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-[#888888]" />
            </Link>
            <h1 className="font-serif text-2xl font-normal text-[#222222]">Your Books</h1>
          </div>
          <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
        </header>

        <BookFilter currentFilter={filter} />

        <div className="bg-texture rounded-xl p-4 mt-6">
          <div className={viewMode === "gallery" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            {isLoading ? (
              viewMode === "gallery" ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-xl bg-white shadow-sm animate-pulse">
                      <div className="aspect-[2/3] bg-gray-200 rounded-t-lg"></div>
                      <div className="p-3">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-xl bg-white p-4 shadow-sm animate-pulse">
                      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              )
            ) : filteredBooks.length > 0 ? (
              viewMode === "gallery" ? (
                <div className="grid grid-cols-2 gap-4">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id || book.local_id || Date.now()}
                      book={book}
                      type={book.type as "read" | "wishlist"}
                      showActions={false}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id || book.local_id || Date.now()}
                      book={book}
                      type={book.type as "read" | "wishlist"}
                      showActions
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                <p className="text-[#888888]">No books found in this category</p>
                <Link href="/add-book" className="mt-2 inline-block text-sm text-[#FFA69E] hover:underline">
                  Add a new book
                </Link>
              </div>
            )}
          </div>
        </div>

        <Link href="/add-book">
          <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#FFA69E] p-0 shadow-md hover:bg-[#D0E2FF] transition-all duration-300">
            <PlusCircle className="h-6 w-6 text-white" />
            <span className="sr-only">Add new book</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}

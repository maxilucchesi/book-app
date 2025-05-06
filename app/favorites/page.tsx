"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getFavoriteBooks } from "@/lib/books"
import { ViewModeToggle } from "@/components/view-mode-toggle"
import { BookCard } from "@/components/book-card"

export default function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "gallery">("gallery")

  // Load favorite books
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true)
      try {
        const books = await getFavoriteBooks()
        setFavoriteBooks(books)
      } catch (error) {
        console.error("Error loading favorite books:", error)
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

    loadFavorites()
  }, [])

  // Handle view mode changes
  const handleViewModeChange = (mode: "list" | "gallery") => {
    setViewMode(mode)
    if (typeof window !== "undefined") {
      localStorage.setItem("giuli-view-mode", mode)
    }
  }

  return (
    <div className="min-h-screen bg-texture p-6">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-[#888888]" />
            </Link>
            <h1 className="font-serif text-2xl font-normal text-[#222222]">Tus Mejores Lecturas del Año 💫</h1>
          </div>
          <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
        </header>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl bg-white shadow-sm animate-pulse">
                <div className="aspect-[2/3] bg-gray-200 rounded-t-lg"></div>
                <div className="p-3">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : favoriteBooks.length > 0 ? (
          viewMode === "gallery" ? (
            <div className="grid grid-cols-2 gap-4">
              {favoriteBooks.map((book) => (
                <BookCard key={book.id || book.local_id || Date.now()} book={book} type="read" viewMode="gallery" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteBooks.map((book) => (
                <BookCard key={book.id || book.local_id || Date.now()} book={book} type="read" viewMode="list" />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-[#888888]">Aún no tienes libros favoritos</p>
            <p className="mt-2 text-sm text-[#888888]">Califica un libro con 5 estrellas para verlo aquí</p>
            <Link href="/add-book" className="mt-4 inline-block text-sm text-[#FFA69E] hover:underline">
              Añadir un nuevo libro
            </Link>
          </div>
        )}

        {favoriteBooks.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-[#888888]">Estos son los libros que tocaron tu corazón este año</p>
            <div className="mt-4 text-2xl">✨📚💖</div>
          </div>
        )}
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/book-card"
import { ArrowLeft, PlusCircle } from "lucide-react"
import { getBooks } from "@/lib/books"
import { BookFilter } from "@/components/book-filter"

// Forzar renderizado dinámico
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  // Obtener el filtro de la URL o usar "all" como valor predeterminado
  const filter = searchParams.filter || "all"

  // Obtener todos los libros
  const books = await getBooks()

  // Filtrar los libros según el filtro seleccionado
  const filteredBooks = filter === "all" ? books : books.filter((book) => book.type === filter)

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-[#888888]" />
          </Link>
          <h1 className="text-3xl font-serif tracking-tight leading-tight text-[#222222]">Your Books</h1>
        </header>

        <BookFilter currentFilter={filter} />

        <div className="space-y-4 mt-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} type={book.type as "read" | "wishlist"} showActions />
            ))
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-[#888888]">No books found in this category</p>
              <Link href="/add-book" className="mt-2 inline-block text-sm text-[#FFA69E] hover:underline">
                Add a new book
              </Link>
            </div>
          )}
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

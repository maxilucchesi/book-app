import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { getFavoriteBooks } from "@/lib/books"

// Forzar renderizado dinámico
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function FavoritesPage() {
  // Obtener libros favoritos (rating 5)
  const favoriteBooks = await getFavoriteBooks()

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-[#888888]" />
          </Link>
          <h1 className="font-serif text-2xl font-normal text-[#222222]">Your Top Reads of the Year 💫</h1>
        </header>

        {favoriteBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {favoriteBooks.map((book) => (
              <Link href={`/edit-book/${book.id}`} key={book.id}>
                <div className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="absolute right-3 top-3 text-[#FFA69E]">
                    <Heart className="h-5 w-5 fill-[#FFA69E]" />
                  </div>

                  <div className="mb-3 h-32 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>

                  <h3 className="font-serif text-base font-medium line-clamp-1 text-[#222222]">{book.title}</h3>
                  <p className="text-sm text-[#888888]">{book.author}</p>

                  <div className="mt-2 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-sm">
                        {i < (book.rating || 0) ? "⭐" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-[#888888]">You don't have any favorite books yet</p>
            <p className="mt-2 text-sm text-[#888888]">Rate a book with 5 stars to see it here</p>
            <Link href="/add-book" className="mt-4 inline-block text-sm text-[#FFA69E] hover:underline">
              Add a new book
            </Link>
          </div>
        )}

        {favoriteBooks.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-[#888888]">These are the books that touched your heart this year</p>
            <div className="mt-4 text-2xl">✨📚💖</div>
          </div>
        )}
      </div>
    </div>
  )
}

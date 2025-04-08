import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen, BookMarked } from "lucide-react"
import { StatsCard } from "@/components/stats-card"

export default async function DashboardPage() {
  // Verificar autenticación
  const user = await requireAuth()
  const supabase = createClient()

  // Obtener libros del usuario
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false })

  // Obtener estadísticas
  const totalBooks = books?.length || 0
  const readBooks = books?.filter((book) => book.status === "terminado").length || 0
  const readingBooks = books?.filter((book) => book.status === "leyendo").length || 0

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mi Biblioteca</h1>
        <Button asChild>
          <Link href="/dashboard/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar libro
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatsCard
          title="Total de libros"
          value={totalBooks}
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Libros leídos"
          value={readBooks}
          icon={<BookMarked className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Leyendo actualmente"
          value={readingBooks}
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {books && books.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Tu biblioteca está vacía</h2>
          <p className="text-muted-foreground mb-4">Agrega tu primer libro para comenzar</p>
          <Button asChild>
            <Link href="/dashboard/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar libro
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

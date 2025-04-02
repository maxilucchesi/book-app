import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { BookCard } from "@/components/book-card"
import { StatsCard } from "@/components/stats-card"
import { Button } from "@/components/ui/button"
import { Book, CheckSquare, Library, PlusCircle } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("userId", user?.id)
    .order("createdAt", { ascending: false })

  // Calcular estadísticas
  const totalBooks = books?.length || 0
  const finishedBooks = books?.filter((book) => book.status === "terminado").length || 0
  const readingBooks = books?.filter((book) => book.status === "leyendo").length || 0

  // Obtener el año actual
  const currentYear = new Date().getFullYear()
  const booksThisYear = books?.filter((book) => book.readYear === currentYear).length || 0

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

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <StatsCard
          title="Total de libros"
          value={totalBooks}
          icon={<Library className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Libros terminados"
          value={finishedBooks}
          icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Leyendo actualmente"
          value={readingBooks}
          icon={<Book className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard title={`Leídos en ${currentYear}`} value={booksThisYear} description="Libros terminados este año" />
      </div>

      {books && books.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No hay libros en tu biblioteca</h2>
          <p className="text-muted-foreground mb-4">Comienza agregando tu primer libro</p>
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


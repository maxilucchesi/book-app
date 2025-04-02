import Link from "next/link"
import type { Book } from "@/lib/supabase/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const statusMap = {
    por_empezar: { label: "Por empezar", color: "bg-blue-100 text-blue-800" },
    leyendo: { label: "Leyendo", color: "bg-yellow-100 text-yellow-800" },
    terminado: { label: "Terminado", color: "bg-green-100 text-green-800" },
    abandonado: { label: "Abandonado", color: "bg-red-100 text-red-800" },
  }

  const status = statusMap[book.status]

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{book.title}</CardTitle>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2">por {book.author}</p>
        {book.review && <p className="text-sm mt-2">{book.review}</p>}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <div>{book.rating && <StarRating rating={book.rating} />}</div>
        <Link href={`/dashboard/edit/${book.id}`} className="text-xs text-primary hover:underline">
          Editar
        </Link>
      </CardFooter>
    </Card>
  )
}


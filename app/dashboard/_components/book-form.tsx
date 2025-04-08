"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { NewBook, UpdateBook } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StarRating } from "@/components/star-rating"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BookFormProps {
  userId: string
  book?: UpdateBook & { id: string }
}

export function BookForm({ userId, book }: BookFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(book?.title || "")
  const [author, setAuthor] = useState(book?.author || "")
  const [status, setStatus] = useState(book?.status || "por_empezar")
  const [readYear, setReadYear] = useState<number | null>(book?.readYear || null)
  const [rating, setRating] = useState<number | null>(book?.rating || null)
  const [review, setReview] = useState(book?.review || "")

  const isCompleted = status === "terminado" || status === "abandonado"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (book?.id) {
        // Actualizar libro existente
        const { error } = await supabase
          .from("books")
          .update({
            title,
            author,
            status,
            readYear: isCompleted ? readYear : null,
            rating: isCompleted ? rating : null,
            review: isCompleted ? review : null,
          })
          .eq("id", book.id)
          .eq("userId", userId)

        if (error) throw error
      } else {
        // Crear nuevo libro
        const { error } = await supabase.from("books").insert({
          title,
          author,
          status,
          readYear: isCompleted ? readYear : null,
          rating: isCompleted ? rating : null,
          review: isCompleted ? review : null,
          userId,
          createdAt: new Date().toISOString(),
        } as NewBook)

        if (error) throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar el libro")
      setIsLoading(false)
    }
  }

  // Generar años para el selector
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Autor</Label>
        <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado de lectura</Label>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as any)
            if (value !== "terminado" && value !== "abandonado") {
              setReadYear(null)
              setRating(null)
              setReview("")
            }
          }}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="por_empezar">Por empezar</SelectItem>
            <SelectItem value="leyendo">Leyendo</SelectItem>
            <SelectItem value="terminado">Terminado</SelectItem>
            <SelectItem value="abandonado">Abandonado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isCompleted && (
        <>
          <div className="space-y-2">
            <Label htmlFor="readYear">Año de lectura</Label>
            <Select value={readYear?.toString() || ""} onValueChange={(value) => setReadYear(Number.parseInt(value))}>
              <SelectTrigger id="readYear">
                <SelectValue placeholder="Selecciona un año" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Puntuación</Label>
            <div className="py-2">
              <StarRating rating={rating || 0} onChange={setRating} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Reseña</Label>
            <Textarea id="review" value={review || ""} onChange={(e) => setReview(e.target.value)} rows={4} />
          </div>
        </>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : book?.id ? "Actualizar libro" : "Agregar libro"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

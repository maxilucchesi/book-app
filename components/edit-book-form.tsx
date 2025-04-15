"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StarRating } from "@/components/star-rating"
import { ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { updateBookAction, deleteBookAction } from "@/app/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Book } from "@/lib/supabase"
import { getLocalBooks } from "@/lib/local-storage"

interface EditBookFormProps {
  book: Book
}

export function EditBookForm({ book }: EditBookFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [bookType, setBookType] = useState(book.type)
  const [rating, setRating] = useState(book.rating || 0)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    date_finished: book.date_finished || "",
    review: book.review || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Preparar los datos según el tipo de libro
      const bookData = {
        title: formData.title,
        author: formData.author,
        type: bookType as "read" | "wishlist",
        ...(bookType === "read" && {
          rating: rating > 0 ? rating : null,
          date_finished: formData.date_finished || null,
          review: formData.review || null,
        }),
        ...(bookType === "wishlist" && {
          rating: null,
          date_finished: null,
          review: null,
        }),
      }

      // Mostrar toast de éxito antes de la redirección
      toast({
        title: "¡Éxito!",
        description: "Tu libro ha sido actualizado.",
      })

      // Usar el Server Action para actualizar el libro
      const result = await updateBookAction(book.id, bookData)

      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        throw new Error("No se pudo actualizar el libro")
      }
    } catch (error) {
      console.error("Error updating book:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar tu libro. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      // Usar el Server Action para eliminar el libro
      const result = await deleteBookAction(book.id)

      if (result.success) {
        // Mostrar toast de éxito antes de la redirección
        toast({
          title: "Libro eliminado",
          description: "El libro ha sido eliminado de tu colección.",
        })

        // Forzar una actualización del localStorage
        if (typeof window !== "undefined") {
          const localBooks = getLocalBooks()
          const filteredBooks = localBooks.filter((b) => b.id !== book.id && b.local_id !== book.id)
          localStorage.setItem("giuli-books", JSON.stringify(filteredBooks))

          // Disparar evento de actualización
          if (typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("booksUpdated", { detail: { action: "delete", id: book.id } }))
          }
        }

        // Redirigir al dashboard con un parámetro para forzar actualización
        router.push(`/dashboard?refresh=${Date.now()}`)
        router.refresh()
      } else {
        throw new Error("No se pudo eliminar el libro")
      }
    } catch (error) {
      console.error("Error deleting book:", error)

      // Mostrar el mensaje de error
      const errorMessage =
        error instanceof Error ? error.message : "Hubo un problema al eliminar tu libro. Por favor, inténtalo de nuevo."
      setDeleteError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <header className="mb-8 flex items-center">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-[#888888]" />
        </Link>
        <h1 className="font-serif text-2xl font-normal text-[#222222]">Editar Libro</h1>
      </header>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <RadioGroup
            defaultValue={book.type}
            className="mb-6 flex rounded-full bg-[#F5F5F5] p-1"
            onValueChange={setBookType}
          >
            <div className="w-1/2">
              <RadioGroupItem value="read" id="read" className="peer sr-only" />
              <Label
                htmlFor="read"
                className="flex cursor-pointer justify-center rounded-full py-2 text-center text-sm peer-data-[state=checked]:bg-[#D0E2FF] peer-data-[state=checked]:text-[#222222] text-[#888888] transition-all duration-200"
              >
                Leído
              </Label>
            </div>
            <div className="w-1/2">
              <RadioGroupItem value="wishlist" id="wishlist" className="peer sr-only" />
              <Label
                htmlFor="wishlist"
                className="flex cursor-pointer justify-center rounded-full py-2 text-center text-sm peer-data-[state=checked]:bg-[#D0E2FF] peer-data-[state=checked]:text-[#222222] text-[#888888] transition-all duration-200"
              >
                Deseo leer
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-[#888888]">
                Título del libro
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="rounded-lg border-[#D0E2FF] bg-white px-4 py-2 text-[#222222] placeholder:text-[#CCCCCC] focus:border-[#FFA69E] focus:ring-[#FFA69E]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm text-[#888888]">
                Autor
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={handleChange}
                className="rounded-lg border-[#D0E2FF] bg-white px-4 py-2 text-[#222222] placeholder:text-[#CCCCCC] focus:border-[#FFA69E] focus:ring-[#FFA69E]"
                required
              />
            </div>

            {bookType === "read" && (
              <div className="space-y-2">
                <Label htmlFor="date_finished" className="text-sm text-[#888888]">
                  Fecha de finalización
                </Label>
                <Input
                  id="date_finished"
                  type="date"
                  value={formData.date_finished}
                  onChange={handleChange}
                  className="rounded-lg border-[#D0E2FF] bg-white px-4 py-2 text-[#222222] focus:border-[#FFA69E] focus:ring-[#FFA69E]"
                />
              </div>
            )}

            {bookType === "read" && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm text-[#888888]">Valoración</Label>
                  <StarRating rating={rating} setRating={setRating} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review" className="text-sm text-[#888888]">
                    Tus pensamientos
                  </Label>
                  <Textarea
                    id="review"
                    value={formData.review}
                    onChange={handleChange}
                    className="min-h-[100px] rounded-lg border-[#D0E2FF] bg-white px-4 py-2 text-[#222222] placeholder:text-[#CCCCCC] focus:border-[#FFA69E] focus:ring-[#FFA69E]"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {deleteError && (
          <div className="rounded-lg bg-red-500 p-4 text-white">
            <p>{deleteError}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-[#D0E2FF] text-[#222222] hover:bg-[#FFA69E] transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Actualizando..." : "Actualizar libro"}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-full border-[#FFA69E] text-[#FFA69E] hover:bg-[#FFF0EE] transition-all duration-300"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Eliminando..." : "Eliminar libro"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-serif text-xl text-[#222222]">¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription className="text-[#888888]">
                  Esto eliminará permanentemente este libro de tu colección.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
                <AlertDialogAction
                  className="h-10 rounded-full bg-[#FFA69E] text-white hover:bg-[#FF8A7E] transition-all duration-300"
                  onClick={handleDelete}
                >
                  Sí, eliminar libro
                </AlertDialogAction>
                <AlertDialogCancel className="h-10 rounded-full border-[#888888] text-[#888888] hover:bg-[#F5F5F5] transition-all duration-300">
                  Cancelar
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Link href="/dashboard">
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full rounded-full text-[#888888] hover:bg-[#F5F5F5] transition-all duration-300"
            >
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </>
  )
}

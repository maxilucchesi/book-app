"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { NewWishlistItem, UpdateWishlistItem } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search } from "lucide-react"

interface WishlistFormProps {
  userId: string
  item?: UpdateWishlistItem & { id: string }
}

export function WishlistForm({ userId, item }: WishlistFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(item?.title || "")
  const [author, setAuthor] = useState(item?.author || "")
  const [coverUrl, setCoverUrl] = useState(item?.coverUrl || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (item?.id) {
        // Actualizar item existente
        const { error } = await supabase
          .from("wishlist")
          .update({
            title,
            author,
            coverUrl,
          })
          .eq("id", item.id)
          .eq("userId", userId)

        if (error) throw error
      } else {
        // Crear nuevo item
        const { error } = await supabase.from("wishlist").insert({
          title,
          author,
          coverUrl,
          userId,
          createdAt: new Date().toISOString(),
        } as NewWishlistItem)

        if (error) throw error
      }

      router.push("/dashboard/wishlist")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar el item")
      setIsLoading(false)
    }
  }

  // Función para buscar portada (placeholder para futura integración)
  const searchBookCover = async () => {
    // Aquí iría la integración con Google Books API u Open Library
    alert(`
      Futura integración con API de libros:
      Búsqueda de: ${title} por ${author}
      
      Ejemplo de integración con Google Books API:
      
      async function searchGoogleBooks(title, author) {
        const query = encodeURIComponent(\`\${title} \${author}\`);
        const response = await fetch(
          \`https://www.googleapis.com/books/v1/volumes?q=\${query}&maxResults=1\`
        );
        const data = await response.json();
        if (data.items && data.items[0]?.volumeInfo?.imageLinks?.thumbnail) {
          return data.items[0].volumeInfo.imageLinks.thumbnail;
        }
        return null;
      }
    `)
  }

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
        <Label htmlFor="coverUrl">URL de la portada</Label>
        <div className="flex gap-2">
          <Input
            id="coverUrl"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://ejemplo.com/portada.jpg"
          />
          <Button type="button" variant="outline" onClick={searchBookCover} disabled={!title || !author}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Ingresa la URL de la imagen de portada o usa el botón de búsqueda (próximamente)
        </p>
      </div>

      {coverUrl && (
        <div className="border rounded-md p-4">
          <p className="text-sm font-medium mb-2">Vista previa:</p>
          <div className="relative h-40 w-full">
            <Image
              src={coverUrl || "/placeholder.svg"}
              alt="Vista previa de portada"
              fill
              className="object-contain"
              onError={() => {
                setCoverUrl("")
                setError("La URL de la imagen no es válida")
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : item?.id ? "Actualizar item" : "Agregar a wishlist"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/wishlist")}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

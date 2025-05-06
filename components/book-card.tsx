"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit2, CloudOff } from "lucide-react"
import { BookDetailDialogEnhanced } from "@/components/book-detail-dialog-enhanced"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BookCardProps {
  book: {
    id?: string
    local_id?: string
    title: string
    author: string
    rating?: number | null
    date_finished?: string
    review?: string
    type: "read" | "wishlist"
    pending_sync?: boolean
    thumbnail?: string | null
  }
  type: "read" | "wishlist"
  showActions?: boolean
  viewMode?: "list" | "gallery"
}

export function BookCard({ book, type, showActions = false, viewMode = "list" }: BookCardProps) {
  // Compact rating display for gallery view
  const compactRating = book.rating ? `${book.rating}⭐️` : null

  // Function to enhance image URL for gallery view
  const getEnhancedImageUrl = (url: string | null | undefined): string => {
    if (!url) return "/abstract-book-cover.png"

    // Para URLs de Google Books, usar un zoom más bajo (2 en lugar de 4)
    if (url.includes("books.google.com")) {
      // Si la URL ya tiene un parámetro zoom, reemplazarlo con zoom=2
      if (url.includes("zoom=")) {
        return url.replace(/zoom=\d/, "zoom=2")
      }

      // Si la URL no tiene un parámetro zoom, añadirlo
      return url.includes("?") ? `${url}&zoom=2` : `${url}?zoom=2`
    }

    return url
  }

  if (viewMode === "gallery") {
    return (
      <BookDetailDialogEnhanced book={book} type={type}>
        <div className="cursor-pointer hover:shadow-md transition-all duration-200">
          <div className="flex flex-col">
            {/* Book cover container - con bordes redondeados en la parte superior */}
            <div className="relative overflow-hidden bg-gray-100 rounded-t-lg">
              {/* Sync status indicator - Eliminado el indicador de favorito */}
              {book.pending_sync && (
                <div className="absolute bottom-2 right-2 z-10 bg-white rounded-full p-1 shadow-sm text-amber-500">
                  <CloudOff className="h-4 w-4" />
                </div>
              )}

              {/* Book cover image con aspect ratio 1:1.545 */}
              <div className="aspect-[1/1.545] w-full">
                <img
                  src={getEnhancedImageUrl(book.thumbnail) || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-full object-cover object-top" /* Mantiene object-cover y object-top */
                  onError={(e) => {
                    e.currentTarget.src = "/abstract-book-cover.png"
                    e.currentTarget.className = "w-full h-full object-contain bg-gray-100"
                  }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Book details con bordes redondeados en la parte inferior */}
            <div
              className={`p-3 pb-4 ${type === "read" ? "bg-white" : "bg-[#F5F5F5]"} rounded-b-lg h-[5.5rem] shadow-sm`}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="font-serif text-sm font-medium text-[#222222] line-clamp-2 break-words hyphens-auto">
                      {book.title}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{book.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-[#888888] line-clamp-1">{book.author}</p>
                {compactRating ? (
                  <span className="text-xs">{compactRating}</span>
                ) : (
                  type === "wishlist" && <span className="text-xs">✨</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </BookDetailDialogEnhanced>
    )
  }

  // Original list view
  return (
    <BookDetailDialogEnhanced book={book} type={type}>
      <div
        className={`rounded-xl ${type === "read" ? "bg-white" : "bg-[#F5F5F5]"} p-4 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200`}
      >
        <div className="flex items-start gap-3">
          {/* Portada del libro si está disponible */}
          {book.thumbnail ? (
            <div className="flex-shrink-0">
              <img
                src={book.thumbnail || "/placeholder.svg"}
                alt={book.title}
                className="h-20 w-14 object-cover object-top rounded-sm shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = "/abstract-book-cover.png"
                  e.currentTarget.className = "h-20 w-14 rounded-sm shadow-sm object-contain bg-gray-100"
                }}
                loading="lazy"
              />
            </div>
          ) : null}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <h3 className="font-serif text-lg font-medium text-[#222222] line-clamp-2">{book.title}</h3>
                <p className="text-sm text-[#888888] line-clamp-1">{book.author}</p>

                {type === "read" && book.rating && (
                  <div className="mt-2 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-sm">
                        {i < book.rating ? "⭐" : "☆"}
                      </span>
                    ))}
                  </div>
                )}

                {type === "wishlist" && (
                  <div className="mt-2 flex items-center text-sm text-[#888888]">
                    <span className="mr-1">✨</span> En tu wishlist
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end">
                {/* Eliminado el corazón para rating 5 */}
                {book.pending_sync && (
                  <div className="text-amber-500 mt-1">
                    <CloudOff className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="mt-3 flex justify-end">
            <Link href={`/edit-book/${book.id || book.local_id}`} onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full text-[#888888] hover:bg-[#F5F5F5] hover:text-[#222222]"
              >
                <Edit2 className="mr-1 h-3 w-3" />
                Editar
              </Button>
            </Link>
          </div>
        )}
      </div>
    </BookDetailDialogEnhanced>
  )
}

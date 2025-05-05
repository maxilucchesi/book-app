"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit2, Heart, CloudOff } from "lucide-react"
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

  if (viewMode === "gallery") {
    return (
      <BookDetailDialogEnhanced book={book} type={type}>
        <div className="cursor-pointer hover:shadow-md transition-all duration-200">
          <div className="flex flex-col">
            {/* Book cover with 2:3 aspect ratio */}
            <div className="relative rounded-t-lg overflow-hidden bg-gray-100">
              {/* Favorite indicator */}
              {book.rating === 5 && (
                <div className="absolute top-2 left-2 z-10 bg-white rounded-full p-1 shadow-sm text-[#FFA69E]">
                  <Heart className="h-4 w-4 fill-[#FFA69E]" />
                </div>
              )}

              {/* Sync status indicator */}
              {book.pending_sync && (
                <div className="absolute bottom-2 right-2 z-10 bg-white rounded-full p-1 shadow-sm text-amber-500">
                  <CloudOff className="h-4 w-4" />
                </div>
              )}

              {/* Book cover image with proper aspect ratio */}
              <div className="aspect-[2/3] w-full">
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/abstract-book-cover.png"
                      e.currentTarget.className = "w-full h-full object-contain bg-gray-100"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
              </div>
            </div>

            {/* Book details with fixed height and tooltip */}
            <div className={`p-3 pb-4 ${type === "read" ? "bg-white" : "bg-[#F5F5F5]"} rounded-b-lg h-[5.5rem]`}>
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
                className="h-20 w-14 object-cover rounded-sm shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = "/abstract-book-cover.png"
                  e.currentTarget.className = "h-20 w-14 rounded-sm shadow-sm object-cover bg-gray-100"
                }}
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
                {book.rating === 5 && (
                  <div className="text-[#FFA69E]">
                    <Heart className="h-5 w-5 fill-[#FFA69E]" />
                  </div>
                )}

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

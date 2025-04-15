"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit2, Heart, CloudOff } from "lucide-react"
import { BookDetailDialog } from "@/components/book-detail-dialog"

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
  }
  type: "read" | "wishlist"
  showActions?: boolean
}

export function BookCard({ book, type, showActions = false }: BookCardProps) {
  return (
    <BookDetailDialog book={book} type={type}>
      <div
        className={`rounded-xl ${type === "read" ? "bg-white" : "bg-[#F5F5F5]"} p-4 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-serif text-lg font-medium text-[#222222]">{book.title}</h3>
            <p className="text-sm text-[#888888]">{book.author}</p>

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
                <span className="mr-1">✨</span> En tu lista de deseos
              </div>
            )}
          </div>

          {book.rating === 5 && (
            <div className="ml-2 text-[#FFA69E]">
              <Heart className="h-5 w-5 fill-[#FFA69E]" />
            </div>
          )}

          {book.pending_sync && (
            <div className="ml-2 text-amber-500">
              <CloudOff className="h-4 w-4" />
            </div>
          )}
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
    </BookDetailDialog>
  )
}

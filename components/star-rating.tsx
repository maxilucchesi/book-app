"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  max?: number
  onChange?: (rating: number) => void
}

export function StarRating({ rating, max = 5, onChange }: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className="flex">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`${onChange ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        </button>
      ))}
    </div>
  )
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          status: "por_empezar" | "leyendo" | "terminado" | "abandonado"
          readYear: number | null
          rating: number | null
          review: string | null
          createdAt: string
          userId: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          status: "por_empezar" | "leyendo" | "terminado" | "abandonado"
          readYear?: number | null
          rating?: number | null
          review?: string | null
          createdAt?: string
          userId: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          status?: "por_empezar" | "leyendo" | "terminado" | "abandonado"
          readYear?: number | null
          rating?: number | null
          review?: string | null
          createdAt?: string
          userId?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          title: string
          author: string
          coverUrl: string | null
          createdAt: string
          userId: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          coverUrl?: string | null
          createdAt?: string
          userId: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          coverUrl?: string | null
          createdAt?: string
          userId?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Book = Database["public"]["Tables"]["books"]["Row"]
export type NewBook = Database["public"]["Tables"]["books"]["Insert"]
export type UpdateBook = Database["public"]["Tables"]["books"]["Update"]

export type WishlistItem = Database["public"]["Tables"]["wishlist"]["Row"]
export type NewWishlistItem = Database["public"]["Tables"]["wishlist"]["Insert"]
export type UpdateWishlistItem = Database["public"]["Tables"]["wishlist"]["Update"]


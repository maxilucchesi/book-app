import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./database.types"

// Tipos para nuestra base de datos
export type Book = {
  id: string
  title: string
  author: string
  type: "read" | "wishlist"
  rating?: number | null
  date_finished?: string | null
  review?: string | null
  created_at: string
  user_id: string
}

// Cliente para componentes del lado del cliente
export const createClient = () => {
  return createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
      auth: {
        persistSession: true,
        storageKey: "giuli-reading-app-auth",
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  })
}

// Cliente de Supabase para uso directo
export const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options: {
    auth: {
      persistSession: true,
      storageKey: "giuli-reading-app-auth",
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
})

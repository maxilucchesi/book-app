import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WishlistForm } from "../_components/wishlist-form"

export default async function AddWishlistPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Agregar a wishlist</h1>
      <WishlistForm userId={user.id} />
    </div>
  )
}


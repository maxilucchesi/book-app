import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WishlistForm } from "../../_components/wishlist-form"

export default async function EditWishlistPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: item } = await supabase.from("wishlist").select("*").eq("id", params.id).eq("userId", user.id).single()

  if (!item) {
    redirect("/dashboard/wishlist")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Editar item de wishlist</h1>
      <WishlistForm userId={user.id} item={item} />
    </div>
  )
}

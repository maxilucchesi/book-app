import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { WishlistCard } from "@/components/wishlist-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function WishlistPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: wishlistItems } = await supabase
    .from("wishlist")
    .select("*")
    .eq("userId", user?.id)
    .order("createdAt", { ascending: false })

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mi Wishlist</h1>
        <Button asChild>
          <Link href="/dashboard/wishlist/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar a wishlist
          </Link>
        </Button>
      </div>

      {wishlistItems && wishlistItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlistItems.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Tu wishlist está vacía</h2>
          <p className="text-muted-foreground mb-4">Agrega libros que quieras leer en el futuro</p>
          <Button asChild>
            <Link href="/dashboard/wishlist/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar a wishlist
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}


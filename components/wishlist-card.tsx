import Link from "next/link"
import Image from "next/image"
import type { WishlistItem } from "@/lib/supabase/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface WishlistCardProps {
  item: WishlistItem
}

export function WishlistCard({ item }: WishlistCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2">por {item.author}</p>
        {item.coverUrl && (
          <div className="relative h-40 w-full mt-2">
            <Image src={item.coverUrl || "/placeholder.svg"} alt={item.title} fill className="object-contain" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-2 border-t">
        <Link href={`/dashboard/wishlist/edit/${item.id}`} className="text-xs text-primary hover:underline">
          Editar
        </Link>
      </CardFooter>
    </Card>
  )
}

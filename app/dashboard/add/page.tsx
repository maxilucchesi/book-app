import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookForm } from "../_components/book-form"

export default async function AddBookPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Agregar nuevo libro</h1>
      <BookForm userId={user.id} />
    </div>
  )
}

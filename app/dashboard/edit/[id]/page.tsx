import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookForm } from "../../_components/book-form"

export default async function EditBookPage({
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

  const { data: book } = await supabase.from("books").select("*").eq("id", params.id).eq("userId", user.id).single()

  if (!book) {
    redirect("/dashboard")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Editar libro</h1>
      <BookForm userId={user.id} book={book} />
    </div>
  )
}

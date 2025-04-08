import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function getUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function getSession() {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export function getSupabaseCookies() {
  const cookieStore = cookies()
  const hasSupabaseCookies = cookieStore.has("sb-access-token") || cookieStore.has("sb-refresh-token")
  return hasSupabaseCookies
}

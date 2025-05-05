import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

// This endpoint will be called by the Vercel cron job to keep the Supabase project active
export async function GET() {
  try {
    console.log("Ping database: Starting database ping")

    // Create Supabase client
    const supabase = createClient()

    // Perform a simple query to keep the database active
    // We're just getting the count of books, which is a lightweight operation
    const { count, error } = await supabase.from("books").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Ping database: Error pinging database:", error)
      return NextResponse.json(
        { success: false, message: "Failed to ping database", error: error.message },
        { status: 500 },
      )
    }

    console.log(`Ping database: Success! Found ${count} books.`)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Database pinged successfully",
      timestamp: new Date().toISOString(),
      count,
    })
  } catch (error) {
    console.error("Ping database: Unexpected error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error", error: String(error) },
      { status: 500 },
    )
  }
}

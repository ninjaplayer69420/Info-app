import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, productId } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("Adding subscriber:", email, "for product:", productId)

    // Add to email subscribers table
    const { data: subscriber, error } = await supabase
      .from("email_subscribers")
      .insert([
        {
          email: email.toLowerCase().trim(),
          product_id: productId,
          source: "product_download",
        },
      ])
      .select()
      .single()

    if (error) {
      // If email already exists, that's okay
      if (error.code === "23505") {
        console.log("Email already exists:", email)
        return NextResponse.json({ success: true, message: "Email already subscribed" })
      }

      console.error("Error adding subscriber:", error)
      return NextResponse.json({ error: "Failed to add subscriber" }, { status: 500 })
    }

    console.log("Subscriber added successfully:", subscriber)

    // Trigger background sync to Substack (in a real app, this would be a queue job)
    // For now, we'll just log it
    console.log("Queuing Substack sync for:", email)

    return NextResponse.json({
      success: true,
      message: "Email added to newsletter",
      subscriber: subscriber,
    })
  } catch (error) {
    console.error("Error in subscribers API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pending = searchParams.get("pending") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    let query = supabase.from("email_subscribers").select("*").order("subscribed_at", { ascending: false }).limit(limit)

    if (pending) {
      query = query.eq("substack_synced", false)
    }

    const { data: subscribers, error } = await query

    if (error) {
      console.error("Error fetching subscribers:", error)
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
    }

    return NextResponse.json(subscribers || [])
  } catch (error) {
    console.error("Error in subscribers GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

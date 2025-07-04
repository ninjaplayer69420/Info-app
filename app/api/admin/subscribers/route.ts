import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pending = searchParams.get("pending") === "true"
    const format = searchParams.get("format")

    let query = supabase.from("email_subscribers").select("*").order("subscribed_at", { ascending: false })

    if (pending) {
      query = query.eq("substack_synced", false)
    }

    const { data: subscribers, error } = await query

    if (error) {
      console.error("Error fetching subscribers:", error)
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
    }

    // If CSV format requested, return CSV
    if (format === "csv") {
      const csvHeader = "Email,Product ID,Subscribed At,Substack Synced,Source\n"
      const csvRows = (subscribers || [])
        .map(
          (sub) =>
            `${sub.email},${sub.product_id || ""},${sub.subscribed_at},${sub.substack_synced},${sub.source || ""}`,
        )
        .join("\n")

      const csvContent = csvHeader + csvRows

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=subscribers.csv",
        },
      })
    }

    return NextResponse.json(subscribers || [])
  } catch (error) {
    console.error("Error in admin subscribers GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const { error } = await supabase.from("email_subscribers").delete().eq("email", email)

    if (error) {
      console.error("Error deleting subscriber:", error)
      return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin subscribers DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

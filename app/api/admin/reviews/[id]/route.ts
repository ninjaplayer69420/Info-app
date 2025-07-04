import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("ratings").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting review:", error)
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin review DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

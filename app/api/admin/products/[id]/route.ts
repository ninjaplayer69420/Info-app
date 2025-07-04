import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Delete all reviews for this product first
    await supabase.from("ratings").delete().eq("product_id", params.id)

    // Delete the product
    const { error } = await supabase.from("products").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin product DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

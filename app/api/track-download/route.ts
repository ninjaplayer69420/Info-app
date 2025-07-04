import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    console.log("Tracking download for product:", productId)

    // Update sales count in Supabase
    const { data: updatedProduct, error } = await supabase
      .from("products")
      .update({
        sales_count: supabase.raw("sales_count + 1"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .select("sales_count")
      .single()

    if (error) {
      console.error("Error updating sales count:", error)
      return NextResponse.json({ error: "Failed to track download" }, { status: 500 })
    }

    console.log("Download tracked, new sales count:", updatedProduct?.sales_count)

    return NextResponse.json({
      success: true,
      salesCount: updatedProduct?.sales_count || 0,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error tracking download:", error)
    return NextResponse.json({ error: "Failed to track download" }, { status: 500 })
  }
}

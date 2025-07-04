import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Transform to expected format
    const transformedProducts = (products || []).map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      longDescription: product.long_description,
      image: product.image,
      price: product.price,
      downloadUrl: product.download_url,
      salesCount: product.sales_count,
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("Error in admin products GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Transform to database format
    const dbProduct = {
      id: productData.id,
      title: productData.title,
      description: productData.description,
      long_description: productData.longDescription,
      image: productData.image,
      price: productData.price,
      download_url: productData.downloadUrl,
      sales_count: productData.salesCount,
    }

    const { data, error } = await supabase.from("products").upsert([dbProduct]).select().single()

    if (error) {
      console.error("Error saving product:", error)
      return NextResponse.json({ error: "Failed to save product" }, { status: 500 })
    }

    return NextResponse.json({ success: true, product: data })
  } catch (error) {
    console.error("Error in admin products POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

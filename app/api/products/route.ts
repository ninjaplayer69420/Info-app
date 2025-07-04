import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Fetching products from Supabase")

    // Get products from Supabase
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (productsError) {
      console.error("Error fetching products:", productsError)
      // Return fallback data if database fails
      return NextResponse.json([
        {
          id: "video-editing-guide",
          title: "Ultimate Guide to Video Editing",
          description: "From Beginner to Getting Clients. Ultimate Video Editing Course.",
          image: "/video-editing-banner.webp",
          price: 0,
          salesCount: 70,
          averageRating: 5,
          ratingsCount: 2,
        },
      ])
    }

    console.log("Fetched products:", products)

    // Get ratings for each product
    const productsWithRatings = await Promise.all(
      (products || []).map(async (product) => {
        const { data: ratings, error: ratingsError } = await supabase
          .from("ratings")
          .select("score")
          .eq("product_id", product.id)

        if (ratingsError) {
          console.error("Error fetching ratings for product:", product.id, ratingsError)
        }

        const ratingsCount = ratings?.length || 0
        const averageRating = ratingsCount > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratingsCount : 0

        return {
          id: product.id,
          title: product.title,
          description: product.description,
          longDescription: product.long_description,
          image: product.image,
          price: product.price,
          downloadUrl: product.download_url,
          salesCount: product.sales_count,
          lastUpdated: product.updated_at,
          averageRating,
          ratingsCount,
        }
      }),
    )

    console.log("Returning products with ratings:", productsWithRatings)
    return NextResponse.json(productsWithRatings)
  } catch (error) {
    console.error("Error fetching products:", error)
    // Return fallback data
    return NextResponse.json([
      {
        id: "video-editing-guide",
        title: "Ultimate Guide to Video Editing",
        description: "From Beginner to Getting Clients. Ultimate Video Editing Course.",
        image: "/video-editing-banner.webp",
        price: 0,
        salesCount: 70,
        averageRating: 5,
        ratingsCount: 2,
      },
    ])
  }
}

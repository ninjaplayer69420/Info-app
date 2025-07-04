import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Fetching product:", params.id)

    // Get product from Supabase
    let { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single()

    if (productError) {
      console.error("Product not found in database, using fallback")
      // Return fallback data if product not in database
      const fallbackProduct = {
        id: params.id,
        title: "Ultimate Guide to Video Editing",
        description: "From Beginner to Getting Clients. Ultimate Video Editing Course.",
        long_description: `From Beginner to Getting Clients. Ultimate Video Editing Course.

This comprehensive video editing bundle contains everything you need to master video editing and start getting clients.

What's included:

CHAPTER 1: Full Capcut Guide
Complete guide to mastering Capcut for mobile and desktop video editing.

CHAPTER 2: 1000+ Presets Pack
Massive collection of professional presets to enhance your videos instantly.

CHAPTER 3: 20+ Effects Tutorials
Step-by-step tutorials for creating stunning visual effects.

CHAPTER 4: Full Premiere Pro Guide
Complete Adobe Premiere Pro course from beginner to advanced.

CHAPTER 5: 50GB+ Editing Pack
Huge collection of editing assets, templates, and resources.

CHAPTER 6: 5 Ways To Get Clients
Proven strategies to find and secure video editing clients.

CHAPTER 7: TOP 50 AI Tools (Ranked)
Comprehensive list of the best AI tools for video creators.

CHAPTER 8: Movie Clips & Memes
Collection of popular clips and meme templates for content creation.

CHAPTER 9: Sound Design
Professional sound design techniques and audio resources.`,
        image: "/video-editing-banner.webp",
        price: 0,
        download_url: `/downloads/${params.id}.pdf`,
        sales_count: 70,
        updated_at: new Date().toISOString(),
      }
      product = fallbackProduct
    }

    // Get ratings for this product from Supabase
    const { data: ratings, error: ratingsError } = await supabase
      .from("ratings")
      .select("*")
      .eq("product_id", params.id)
      .order("created_at", { ascending: false })

    if (ratingsError) {
      console.error("Error fetching ratings:", ratingsError)
    }

    console.log("Fetched ratings from database:", ratings)

    // Transform ratings to expected format
    const transformedRatings = (ratings || []).map((rating) => ({
      id: rating.id,
      userEmail: rating.user_email,
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.created_at,
    }))

    const ratingsCount = transformedRatings.length
    const averageRating = ratingsCount > 0 ? transformedRatings.reduce((sum, r) => sum + r.score, 0) / ratingsCount : 0

    console.log("Returning product with ratings:", { ratingsCount, averageRating })

    return NextResponse.json({
      id: product.id,
      title: product.title,
      description: product.description,
      longDescription: product.long_description,
      image: product.image,
      price: product.price,
      downloadUrl: product.download_url,
      salesCount: product.sales_count,
      lastUpdated: product.updated_at,
      ratings: transformedRatings,
      averageRating,
      ratingsCount,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { action, ...data } = await request.json()

    if (action === "get-user-review") {
      const { userEmail } = data
      console.log("Getting user review for:", userEmail, params.id)

      const { data: userReview, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("product_id", params.id)
        .eq("user_email", userEmail)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user review:", error)
        return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
      }

      console.log("Found user review:", userReview)

      return NextResponse.json({
        success: true,
        review: userReview
          ? {
              id: userReview.id,
              userEmail: userReview.user_email,
              score: userReview.score,
              comment: userReview.comment,
              createdAt: userReview.created_at,
            }
          : null,
      })
    }

    if (action === "track-download") {
      console.log("Tracking download for product:", params.id)

      // Update sales count in Supabase
      const { data: updatedProduct, error } = await supabase
        .from("products")
        .update({
          sales_count: supabase.raw("sales_count + 1"),
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)
        .select("sales_count")
        .single()

      if (error) {
        console.error("Error updating sales count:", error)
        return NextResponse.json({ error: "Failed to track download" }, { status: 500 })
      }

      console.log("Updated sales count:", updatedProduct?.sales_count)

      return NextResponse.json({
        success: true,
        salesCount: updatedProduct?.sales_count || 0,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in product POST:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: reviews, error } = await supabase
      .from("ratings")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    // Transform to expected format
    const transformedReviews = (reviews || []).map((review) => ({
      id: review.id,
      productId: review.product_id,
      userEmail: review.user_email,
      score: review.score,
      comment: review.comment,
      createdAt: review.created_at,
    }))

    return NextResponse.json(transformedReviews)
  } catch (error) {
    console.error("Error in admin reviews GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json()

    // Transform to database format
    const dbReview = {
      id: reviewData.id,
      product_id: reviewData.productId,
      user_email: reviewData.userEmail,
      score: reviewData.score,
      comment: reviewData.comment,
      created_at: reviewData.createdAt,
    }

    const { data, error } = await supabase.from("ratings").upsert([dbReview]).select().single()

    if (error) {
      console.error("Error saving review:", error)
      return NextResponse.json({ error: "Failed to save review" }, { status: 500 })
    }

    return NextResponse.json({ success: true, review: data })
  } catch (error) {
    console.error("Error in admin reviews POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

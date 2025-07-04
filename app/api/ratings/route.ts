import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { productId, userEmail, score, comment } = await request.json()

    console.log("Received rating submission:", { productId, userEmail, score, comment })

    // Validate input
    if (!productId || !userEmail || !score) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (score < 1 || score > 5) {
      return NextResponse.json({ error: "Score must be between 1 and 5" }, { status: 400 })
    }

    // Check if user already reviewed this product
    const { data: existingReview, error: checkError } = await supabase
      .from("ratings")
      .select("*")
      .eq("product_id", productId)
      .eq("user_email", userEmail)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing review:", checkError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existingReview) {
      // UPDATE existing review
      console.log("Updating existing review:", existingReview.id)

      const { data: updatedReview, error: updateError } = await supabase
        .from("ratings")
        .update({
          score: score,
          comment: comment || "",
          created_at: new Date().toISOString(), // Update timestamp
        })
        .eq("id", existingReview.id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating review:", updateError)
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
      }

      console.log("Review updated successfully:", updatedReview)

      return NextResponse.json({
        success: true,
        isUpdate: true,
        rating: {
          id: updatedReview.id,
          userEmail: updatedReview.user_email,
          score: updatedReview.score,
          comment: updatedReview.comment,
          createdAt: updatedReview.created_at,
        },
      })
    } else {
      // CREATE new review
      console.log("Creating new review")

      const { data: newReview, error: insertError } = await supabase
        .from("ratings")
        .insert([
          {
            product_id: productId,
            user_email: userEmail,
            score: score,
            comment: comment || "",
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error("Error creating review:", insertError)
        return NextResponse.json({ error: "Failed to save review" }, { status: 500 })
      }

      console.log("Review created successfully:", newReview)

      return NextResponse.json({
        success: true,
        isUpdate: false,
        rating: {
          id: newReview.id,
          userEmail: newReview.user_email,
          score: newReview.score,
          comment: newReview.comment,
          createdAt: newReview.created_at,
        },
      })
    }
  } catch (error) {
    console.error("Error in ratings API:", error)
    return NextResponse.json({ error: "Failed to save rating" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const userEmail = searchParams.get("userEmail")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    console.log("Fetching reviews for product:", productId, "user:", userEmail)

    const query = supabase
      .from("ratings")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    // If userEmail is provided, we can still return all reviews but this helps with debugging
    const { data: reviews, error } = await query

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json([], { status: 500 })
    }

    console.log("Fetched reviews:", reviews)

    // Transform to expected format
    const transformedReviews = (reviews || []).map((review) => ({
      id: review.id,
      userEmail: review.user_email,
      score: review.score,
      comment: review.comment,
      createdAt: review.created_at,
    }))

    return NextResponse.json(transformedReviews)
  } catch (error) {
    console.error("Error fetching ratings:", error)
    return NextResponse.json([], { status: 500 })
  }
}

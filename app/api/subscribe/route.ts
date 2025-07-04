import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, productId } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("Processing subscription for:", email, "product:", productId)

    // Just save to our database for admin tracking
    // The actual Substack submission is handled directly by the frontend
    const subscriberResponse = await fetch(`${request.nextUrl.origin}/api/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, productId }),
    })

    if (!subscriberResponse.ok) {
      const errorData = await subscriberResponse.json()
      console.error("Failed to add subscriber:", errorData)
      // Don't fail the whole process if database save fails
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
    })
  } catch (error) {
    console.error("Error in subscribe route:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

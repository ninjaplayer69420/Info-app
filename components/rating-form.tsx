"use client"
import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"

interface RatingFormProps {
  productId: string
  userEmail: string
  onRatingSubmitted?: () => void
}

interface ExistingReview {
  id: string
  userEmail: string
  score: number
  comment: string
  createdAt: string
}

export function RatingForm({ productId, userEmail, onRatingSubmitted }: RatingFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkExistingReview()
  }, [productId, userEmail])

  const checkExistingReview = async () => {
    try {
      console.log("Checking existing review for:", userEmail, productId)

      const response = await fetch(`/api/ratings?productId=${productId}&userEmail=${encodeURIComponent(userEmail)}`)

      if (response.ok) {
        const reviews = await response.json()
        console.log("All reviews:", reviews)
        const userReview = reviews.find((r: any) => r.userEmail === userEmail)

        if (userReview) {
          console.log("Found existing review:", userReview)
          setExistingReview(userReview)
          setRating(userReview.score)
          setComment(userReview.comment || "")
        } else {
          console.log("No existing review found")
          setExistingReview(null)
        }
      }
    } catch (error) {
      console.error("Error checking existing review:", error)
    } finally {
      setLoading(false)
    }
  }

  // FORCE EDIT MODE
  const forceEditMode = () => {
    console.log("🔥 EDIT BUTTON CLICKED - FORCING EDIT MODE!")
    setIsEditing(true)
    setError("")
    setHasSubmitted(false) // Reset submitted state
  }

  // FORCE CANCEL
  const forceCancel = () => {
    console.log("🔥 CANCEL CLICKED - FORCING CANCEL!")
    if (existingReview) {
      setRating(existingReview.score)
      setComment(existingReview.comment || "")
    }
    setIsEditing(false)
    setError("")
    setHasSubmitted(false)
  }

  const handleStarClick = (starValue: number) => {
    console.log("Star clicked:", starValue)
    setRating(starValue)
    setError("")
  }

  const handleTextChange = (value: string) => {
    setComment(value)
    setError("")
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      console.log("Submitting review:", { productId, userEmail, score: rating, comment })

      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          userEmail,
          score: rating,
          comment: comment.trim(),
        }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok && data.success) {
        setHasSubmitted(true)
        setIsEditing(false)

        // Update the existing review state
        if (data.rating) {
          setExistingReview(data.rating)
        }

        setTimeout(() => {
          onRatingSubmitted?.()
        }, 1000)
      } else {
        setError(data.error || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setError("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // LOADING STATE
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-400 mt-2">Loading...</p>
      </div>
    )
  }

  // SUCCESS STATE
  if (hasSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {existingReview ? "Review Updated!" : "Thank you for your review!"}
        </h3>
        <p className="text-green-400">
          {existingReview
            ? "Your review has been updated successfully."
            : "Your review has been saved and will help other customers."}
        </p>
      </div>
    )
  }

  // READ-ONLY VIEW - Show existing review when not editing
  if (existingReview && !isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Your Review</h3>

          {/* EDIT BUTTON - MULTIPLE EVENT HANDLERS */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("EDIT BUTTON CLICKED!")
              forceEditMode()
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("EDIT BUTTON TOUCHED!")
              forceEditMode()
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("EDIT BUTTON MOUSE DOWN!")
              forceEditMode()
            }}
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("EDIT BUTTON POINTER DOWN!")
              forceEditMode()
            }}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              minHeight: "48px",
              minWidth: "140px",
              touchAction: "manipulation",
              userSelect: "none",
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
              WebkitTapHighlightColor: "rgba(37, 99, 235, 0.3)",
              position: "relative",
              zIndex: 1000,
            }}
          >
            ✏️ Edit Review
          </button>
        </div>

        <div className="glass-card shine-border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-lg">
                  {star <= existingReview.score ? "⭐" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-yellow-400 font-medium">{existingReview.score}/5 stars</span>
          </div>

          {existingReview.comment && <p className="text-gray-300 leading-relaxed mb-4">{existingReview.comment}</p>}

          <p className="text-xs text-gray-500">
            Reviewed on{" "}
            {new Date(existingReview.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    )
  }

  // FORM VIEW - Show when no existing review OR when editing existing review
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">{existingReview ? "Edit Your Review" : "Leave a Review"}</h3>
        {existingReview && isEditing && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("CANCEL CLICKED!")
              forceCancel()
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("CANCEL TOUCHED!")
              forceCancel()
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("CANCEL MOUSE DOWN!")
              forceCancel()
            }}
            style={{
              backgroundColor: "#6b7280",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              minHeight: "48px",
              touchAction: "manipulation",
              userSelect: "none",
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* STARS */}
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleStarClick(star)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleStarClick(star)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleStarClick(star)
                }}
                style={{
                  width: "48px",
                  height: "48px",
                  fontSize: "20px",
                  borderRadius: "8px",
                  border: star <= rating ? "2px solid #fbbf24" : "2px solid #374151",
                  backgroundColor: star <= rating ? "rgba(255, 255, 0, 0.2)" : "rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  touchAction: "manipulation",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                }}
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
          {rating > 0 && <p className="text-sm text-yellow-400 mt-2 font-medium">Rating: {rating}/5 stars</p>}
        </div>

        {/* TEXTAREA */}
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Leave a comment (optional)..."
            rows={4}
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "16px",
              fontSize: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "2px solid #4b5563",
              borderRadius: "12px",
              color: "white",
              outline: "none",
              resize: "vertical",
            }}
          />
          <div className="text-xs text-gray-500 mt-1">Characters: {comment.length}</div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!isSubmitting) handleSubmit()
          }}
          onTouchStart={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!isSubmitting) handleSubmit()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!isSubmitting) handleSubmit()
          }}
          disabled={isSubmitting}
          style={{
            width: "100%",
            minHeight: "60px",
            backgroundColor: isSubmitting ? "#6b7280" : "#059669",
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
            borderRadius: "12px",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            padding: "16px",
            touchAction: "manipulation",
            opacity: isSubmitting ? 0.5 : 1,
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
          }}
        >
          {isSubmitting ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: "8px",
                }}
              />
              {existingReview ? "Updating..." : "Submitting..."}
            </div>
          ) : existingReview ? (
            "UPDATE REVIEW"
          ) : (
            "SUBMIT REVIEW"
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

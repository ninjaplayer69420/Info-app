import { Star } from "lucide-react"

interface Rating {
  id: string
  userEmail: string
  score: number
  comment: string
  createdAt: string
}

interface RatingsListProps {
  ratings: Rating[]
}

export function RatingsList({ ratings }: RatingsListProps) {
  if (ratings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No reviews yet. Be the first to leave a review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {ratings.map((rating) => (
        <div key={rating.id} className="border-b border-white/10 pb-8 last:border-b-0">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= rating.score ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 ml-2">
              {new Date(rating.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <p className="text-gray-300 leading-relaxed text-lg">{rating.comment}</p>
          <div className="mt-2">
            <span className="text-xs text-gray-500">{rating.userEmail.replace(/(.{2}).*@/, "$1***@")}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

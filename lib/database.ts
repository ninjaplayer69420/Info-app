// In-memory database for demo - replace with real database in production
interface DatabaseRating {
  id: string
  productId: string
  userEmail: string
  score: number
  comment: string
  createdAt: Date
}

interface DatabaseProduct {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  price: number
  downloadUrl: string
  salesCount: number
  lastUpdated: Date
}

// In-memory storage (replace with real database)
const ratings: DatabaseRating[] = [
  {
    id: "1",
    productId: "video-editing-guide",
    userEmail: "user1@example.com",
    score: 5,
    comment: "Excellent guide! Very comprehensive and easy to follow.",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    productId: "video-editing-guide",
    userEmail: "user2@example.com",
    score: 4,
    comment: "Great content, helped me improve my editing skills significantly.",
    createdAt: new Date("2024-01-20"),
  },
]

const products: DatabaseProduct[] = [
  {
    id: "video-editing-guide",
    title: "Complete Video Editing Guide",
    description: "Master video editing with this comprehensive guide covering all the essential techniques and tools.",
    longDescription: `This comprehensive video editing guide will take you from beginner to advanced level. Learn professional techniques used by industry experts, master popular editing software, and create stunning videos that captivate your audience.

What you'll learn:
• Professional video editing workflows
• Color correction and grading techniques
• Audio editing and mixing
• Motion graphics and effects
• Export settings for different platforms
• Time-saving tips and shortcuts

Perfect for content creators, YouTubers, and anyone looking to improve their video editing skills.`,
    image: "/placeholder.svg?height=400&width=600",
    price: 0,
    downloadUrl: "/downloads/video-editing-guide.pdf",
    salesCount: 247,
    lastUpdated: new Date("2024-12-15"),
  },
]

export const database = {
  // Products
  getProducts: () => products,
  getProduct: (id: string) => products.find((p) => p.id === id),
  updateProductSalesCount: (id: string) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      product.salesCount += 1
      product.lastUpdated = new Date()
    }
    return product
  },

  // Ratings
  getRatings: (productId: string) => ratings.filter((r) => r.productId === productId),
  addRating: (rating: Omit<DatabaseRating, "id" | "createdAt">) => {
    const newRating: DatabaseRating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    ratings.push(newRating)
    return newRating
  },
  getRatingAverage: (productId: string) => {
    const productRatings = ratings.filter((r) => r.productId === productId)
    if (productRatings.length === 0) return 0
    return productRatings.reduce((sum, r) => sum + r.score, 0) / productRatings.length
  },
}

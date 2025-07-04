export interface Rating {
  id: string
  userEmail: string
  score: number
  comment: string
  createdAt: Date
}

export interface Product {
  id: string
  title: string
  description: string
  image: string
  price: number
  salesCount: number
  downloadUrl: string
  ratings: Rating[]
  longDescription: string
}

export const products: Product[] = [
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
    salesCount: 247,
    downloadUrl: "/downloads/video-editing-guide.pdf",
    ratings: [
      {
        id: "1",
        userEmail: "user1@example.com",
        score: 5,
        comment: "Excellent guide! Very comprehensive and easy to follow.",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        userEmail: "user2@example.com",
        score: 4,
        comment: "Great content, helped me improve my editing skills significantly.",
        createdAt: new Date("2024-01-20"),
      },
    ],
  },
]

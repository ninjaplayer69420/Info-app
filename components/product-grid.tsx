"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"

interface Product {
  id: string
  title: string
  description: string
  image: string
  price: number
  salesCount: number
  averageRating: number
  ratingsCount: number
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        // Fallback data if API fails
        setProducts([
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
    } catch (error) {
      console.error("Error fetching products:", error)
      // Fallback data
      setProducts([
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
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-800 rounded-2xl mb-4"></div>
            <div className="h-6 bg-gray-800 rounded mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

// Simplified product type with only essential fields
interface SimpleProduct {
  id: string
  title: string
  description: string
  image: string
  price: number
}

// Hardcoded fallback product in case API fails
const fallbackProducts: SimpleProduct[] = [
  {
    id: "video-editing-guide",
    title: "Complete Video Editing Guide",
    description: "Master video editing with this comprehensive guide covering all the essential techniques and tools.",
    image: "/placeholder.svg?height=400&width=600",
    price: 0,
  },
]

export function ProductGridSimple() {
  const [products, setProducts] = useState<SimpleProduct[]>(fallbackProducts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`)
        }
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        }
      } catch (err) {
        console.error("Failed to load products:", err)
        setError("Failed to load products. Using fallback data.")
        // Keep using fallback products
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

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
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="glass-card shine-border rounded-2xl overflow-hidden hover-glow cursor-pointer group">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg?height=400&width=600"}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.price === 0 && (
                  <Badge className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm border-green-400/30">
                    FREE
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-3 line-clamp-2 text-white">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className="font-bold text-lg text-white">
                      {product.price === 0 ? "FREE" : `$${product.price}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

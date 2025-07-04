"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import NextImage from "next/image"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  title: string
  description: string
  image: string
  price: number
  averageRating: number
  ratingsCount: number
}

interface MoreProductsPreviewProps {
  currentProductId: string
}

export function MoreProductsPreview({ currentProductId }: MoreProductsPreviewProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [currentProductId])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        // Filter out current product and limit to 6 products
        const otherProducts = data.filter((p: Product) => p.id !== currentProductId).slice(0, 6)
        setProducts(otherProducts)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">More Products</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 animate-pulse">
              <div className="aspect-video bg-gray-800 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-800 rounded mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-4">More Products</h2>
      <div
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="flex-shrink-0 w-64 glass-card shine-border rounded-xl overflow-hidden hover-glow cursor-pointer group">
              <div className="aspect-video relative overflow-hidden">
                <NextImage
                  src={product.image || "/placeholder.svg?height=200&width=300"}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.price === 0 && (
                  <Badge className="absolute top-2 right-2 bg-green-500/80 backdrop-blur-sm border-green-400/30 text-xs">
                    FREE
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-white">{product.title}</h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <svg
                          key={n}
                          viewBox="0 0 24 24"
                          className={`w-3 h-3 ${n <= (product.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-.99L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-medium text-white ml-1">
                      {(product.averageRating || 0).toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">({product.ratingsCount || 0})</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-white">
                      {product.price === 0 ? "FREE" : `$${product.price}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

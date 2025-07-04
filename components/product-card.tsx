"use client"

import { useState, useEffect } from "react"
import NextImage from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Custom star component to avoid lucide-react issues
const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-4 h-4 ${filled ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
    fill="currentColor"
  >
    <path d="M12 2l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-.99L12 2z" />
  </svg>
)

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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(16 / 9)

  useEffect(() => {
    if (product.image) {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const ratio = img.width / img.height
        setImageAspectRatio(ratio || 16 / 9)
      }
      img.onerror = () => {
        setImageAspectRatio(16 / 9) // fallback
      }
      img.src = product.image
    }
  }, [product.image])

  return (
    <Link href={`/product/${product.id}`}>
      <div className="glass-card shine-border rounded-2xl overflow-hidden hover-glow cursor-pointer group">
        <div className="relative overflow-hidden" style={{ aspectRatio: imageAspectRatio }}>
          <NextImage
            src={product.image || "/placeholder.svg?height=400&width=600"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.price === 0 && (
            <Badge className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm border-green-400/30">FREE</Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-xl mb-3 line-clamp-2 text-white">{product.title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{product.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon key={n} filled={n <= (product.averageRating || 0)} />
                ))}
                <span className="text-sm font-medium text-white">{(product.averageRating || 0).toFixed(1)}</span>
                <span className="text-sm text-gray-500">({product.ratingsCount || 0})</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-white">{product.price === 0 ? "FREE" : `$${product.price}`}</div>
              <div className="text-sm text-gray-400">{product.salesCount} downloads</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

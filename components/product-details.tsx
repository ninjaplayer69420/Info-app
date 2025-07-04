"use client"

import { useState, useEffect, useRef } from "react"
import NextImage from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmailForm } from "./email-form"
import { RatingForm } from "./rating-form"
import { RatingsList } from "./ratings-list"
import { MoreProductsPreview } from "./more-products-preview"
import { MarkdownRenderer } from "./markdown-renderer"

// Custom star component to avoid lucide-react issues
const StarIcon = ({ filled = false, size = 4 }: { filled?: boolean; size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-${size} h-${size} ${filled ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
    fill="currentColor"
  >
    <path d="M12 2l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-.99L12 2z" />
  </svg>
)

interface Rating {
  id: string
  userEmail: string
  score: number
  comment: string
  createdAt: string
}

interface Product {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  price: number
  downloadUrl: string
  salesCount: number
  lastUpdated: string
  ratings: Rating[]
  averageRating: number
  ratingsCount: number
}

interface ProductDetailsProps {
  productId: string
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(true)
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(16 / 9)
  const emailSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchProduct()
    const email = localStorage.getItem(`user-email-${productId}`)
    const downloaded = localStorage.getItem(`downloaded-${productId}`)
    if (email) {
      setUserEmail(email)
    }
    if (downloaded) {
      setHasDownloaded(true)
    }
  }, [productId])

  useEffect(() => {
    const handleScroll = () => {
      if (emailSectionRef.current) {
        const rect = emailSectionRef.current.getBoundingClientRect()
        setShowStickyBar(rect.top > window.innerHeight)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const productData = await response.json()

        // Transform snake_case keys from the API into camelCase the UI expects
        const transformed = {
          ...productData,
          longDescription: productData.long_description ?? productData.longDescription ?? "",
          downloadUrl: productData.download_url ?? productData.downloadUrl,
          salesCount: productData.sales_count ?? productData.salesCount ?? 0,
          lastUpdated: productData.updated_at ?? productData.lastUpdated,
        }

        setProduct(transformed as Product)

        // Calculate image aspect ratio safely
        if (productData.image) {
          const img = new window.Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            const ratio = img.width / img.height
            setImageAspectRatio(ratio || 16 / 9)
          }
          img.onerror = () => {
            setImageAspectRatio(16 / 9) // fallback
          }
          img.src = productData.image
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetProduct = () => {
    setShowEmailForm(true)
    emailSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleEmailSubmitted = (email: string) => {
    setUserEmail(email)
    setShowEmailForm(false)
    localStorage.setItem(`user-email-${productId}`, email)
    // Directly go to download page
    window.location.href = `/download/${productId}?email=${encodeURIComponent(email)}`
  }

  const handleRatingSubmitted = () => {
    // Force refresh the product data from server
    fetchProduct()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="aspect-video bg-gray-800 rounded-2xl mb-8"></div>
            <div className="h-8 bg-gray-800 rounded mb-4"></div>
            <div className="h-6 bg-gray-800 rounded w-1/3 mb-8"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 pt-8 pb-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Product not found</h1>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 pt-8 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Product Image - Dynamic aspect ratio */}
          <div className="relative overflow-hidden rounded-2xl mb-8" style={{ aspectRatio: imageAspectRatio }}>
            <NextImage
              src={product.image || "/placeholder.svg?height=400&width=600"}
              alt={product.title}
              fill
              className="object-cover"
            />
            {product.price === 0 && (
              <Badge className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm border-green-400/30">
                FREE
              </Badge>
            )}
          </div>

          {/* Product Name - Smaller */}
          <h1 className="text-2xl font-bold text-white mb-4">{product.title}</h1>

          {/* Price and Ratings Row */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="glass-card shine-border rounded-xl px-4 py-2">
              <div className="text-xl font-bold text-white">{product.price === 0 ? "$0" : `$${product.price}`}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon key={n} filled={n <= (product.averageRating || 0)} size={4} />
                ))}
                <span className="text-sm font-medium text-white ml-1">{(product.averageRating || 0).toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.ratingsCount || 0})</span>
              </div>
            </div>
          </div>

          {/* Description with Markdown Support */}
          <div className="mb-12">
            <MarkdownRenderer content={product.longDescription ?? ""} />
          </div>

          {/* Email Form Section */}
          <div ref={emailSectionRef} className="mb-12">
            {!userEmail && !showEmailForm && (
              <div className="w-full">
                <Button
                  onClick={handleGetProduct}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-4 px-8 text-lg shine-border shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Get Now
                </Button>
              </div>
            )}

            {showEmailForm && (
              <div className="max-w-md mx-auto">
                <EmailForm
                  productId={product.id}
                  onEmailSubmitted={handleEmailSubmitted}
                  productTitle={product.title}
                />
              </div>
            )}

            {userEmail && (
              <div className="w-full">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-4 px-8 text-lg shadow-lg"
                >
                  <a href={`/download/${product.id}`}>
                    <Download className="w-5 h-5 mr-2" />
                    {hasDownloaded ? "Download Again" : "Download Now"}
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{product.salesCount}</div>
                <div className="text-sm text-gray-400">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{(product.averageRating || 0).toFixed(1)}</div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{product.price === 0 ? "$0" : `$${product.price}`}</div>
                <div className="text-sm text-gray-400">Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {new Date(product.lastUpdated).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
                <div className="text-sm text-gray-400">Updated</div>
              </div>
            </div>
          </div>

          {/* More Products Preview */}
          <MoreProductsPreview currentProductId={product.id} />

          {/* Reviews Section */}
          <div className="space-y-8">
            {userEmail && (
              <div className="glass-card shine-border rounded-2xl p-8">
                <RatingForm productId={product.id} userEmail={userEmail} onRatingSubmitted={handleRatingSubmitted} />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Reviews</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <StarIcon key={n} filled={n <= (product.averageRating || 0)} size={4} />
                    ))}
                    <span className="text-white font-medium ml-1">{(product.averageRating || 0).toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{product.ratingsCount || 0} reviews</span>
                </div>
              </div>
              <RatingsList ratings={product.ratings || []} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      {showStickyBar && !userEmail && (
        <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 p-4 z-40">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="glass-card shine-border rounded-xl px-4 py-2">
                <div className="text-xl font-bold text-white">{product.price === 0 ? "$0" : `$${product.price}`}</div>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon key={n} filled={n <= (product.averageRating || 0)} size={3} />
                ))}
                <span className="text-sm font-medium text-white ml-1">{(product.averageRating || 0).toFixed(1)}</span>
              </div>
            </div>
            <Button
              onClick={handleGetProduct}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-8 min-w-[140px] shadow-lg"
            >
              Get Now
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

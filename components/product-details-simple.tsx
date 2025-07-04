"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmailForm } from "./email-form"

// Simplified product type
interface SimpleProduct {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  price: number
}

// Fallback product in case API fails
const fallbackProduct: SimpleProduct = {
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
}

interface ProductDetailsSimpleProps {
  productId: string
}

export function ProductDetailsSimple({ productId }: ProductDetailsSimpleProps) {
  const [product, setProduct] = useState<SimpleProduct>(fallbackProduct)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(true)
  const emailSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`)
        }
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        console.error("Failed to load product:", err)
        setError("Failed to load product details. Using fallback data.")
        // Keep using fallback product
      } finally {
        setLoading(false)
      }
    }

    loadProduct()

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

  const handleGetProduct = () => {
    setShowEmailForm(true)
    emailSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleEmailSubmitted = (email: string) => {
    setUserEmail(email)
    setShowEmailForm(false)
    localStorage.setItem(`user-email-${productId}`, email)
    window.location.href = `/download/${productId}?email=${encodeURIComponent(email)}`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-24">
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

  return (
    <>
      <div className="container mx-auto px-4 pt-28 pb-24">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Product Image */}
          <div className="aspect-video relative overflow-hidden rounded-2xl mb-8">
            <Image
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

          {/* Product Name */}
          <h1 className="text-3xl font-bold text-white mb-6">{product.title}</h1>

          {/* Price in highlighted box */}
          <div className="flex items-center justify-between mb-8">
            <div className="glass-card shine-border rounded-xl px-4 py-2">
              <div className="text-2xl font-bold text-white">{product.price === 0 ? "$0" : `$${product.price}`}</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12">
            <div className="prose prose-invert max-w-none">
              {product.longDescription.split("\n").map((paragraph, index) => {
                if (paragraph.trim() === "") return null

                if (paragraph.startsWith("•")) {
                  return (
                    <div key={index} className="flex items-start space-x-3 mb-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 leading-relaxed">{paragraph.substring(1).trim()}</p>
                    </div>
                  )
                }

                if (paragraph.includes(":") && paragraph.length < 50) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-white mt-8 mb-4">
                      {paragraph}
                    </h3>
                  )
                }

                return (
                  <p key={index} className="text-gray-300 mb-4 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>

          {/* Email Form Section */}
          <div ref={emailSectionRef} className="mb-12">
            {!userEmail && !showEmailForm && (
              <div className="w-full">
                <Button
                  onClick={handleGetProduct}
                  size="lg"
                  className="w-full bg-white text-black font-medium py-4 px-8 text-lg shine-border hover:bg-white"
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
                  className="w-full bg-green-600 hover:bg-green-700 font-medium py-4 px-8 text-lg"
                >
                  <a href={`/download/${product.id}`}>
                    <Download className="w-5 h-5 mr-2" />
                    {hasDownloaded ? "Download Again" : "Download Now"}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      {showStickyBar && !userEmail && (
        <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 p-4 z-40">
          <div className="container mx-auto flex items-center justify-between">
            <div className="glass-card shine-border rounded-xl px-4 py-2">
              <div className="text-xl font-bold text-white">{product.price === 0 ? "$0" : `$${product.price}`}</div>
            </div>
            <Button
              onClick={handleGetProduct}
              size="lg"
              className="bg-white text-black hover:bg-white font-medium py-3 px-6"
            >
              Get Now
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

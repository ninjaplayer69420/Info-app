"use client"

import { useEffect, useState } from "react"
import { Download, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfettiEffect } from "./confetti-effect"
import { MarkdownRenderer } from "./markdown-renderer"

interface DownloadPageSimpleProps {
  productId: string
}

export function DownloadPageSimple({ productId }: DownloadPageSimpleProps) {
  const [title, setTitle] = useState("Product")
  const [downloadContent, setDownloadContent] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasDownloaded, setHasDownloaded] = useState(false)

  useEffect(() => {
    // Try to get product title and content
    async function loadProductData() {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          if (data && data.title) {
            setTitle(data.title)
          }
          if (data && data.longDescription) {
            setDownloadContent(data.longDescription)
          }
        }
      } catch (err) {
        console.error("Failed to load product data:", err)
      }
    }

    loadProductData()

    const downloaded = localStorage.getItem(`downloaded-${productId}`)
    if (downloaded) {
      setHasDownloaded(true)
    }
  }, [productId])

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement("a")
    link.href = `/downloads/${productId}.pdf`
    link.download = `${title}.pdf`
    link.click()

    setShowConfetti(true)
    setHasDownloaded(true)
    localStorage.setItem(`downloaded-${productId}`, "true")

    // Track download
    try {
      fetch("/api/track-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })
    } catch (err) {
      console.error("Failed to track download:", err)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center shine-border">
            {hasDownloaded ? (
              <CheckCircle className="w-10 h-10 text-green-400" />
            ) : (
              <Download className="w-10 h-10 text-white" />
            )}
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white glow-text">Thanks for getting '{title}'</h1>
            <h2 className="text-2xl font-medium text-gray-300">Content:</h2>
          </div>

          {/* Content with Markdown Support */}
          {downloadContent && (
            <div className="max-w-3xl mx-auto text-left mb-12">
              <MarkdownRenderer content={downloadContent} />
            </div>
          )}

          <Button
            onClick={handleDownload}
            size="lg"
            className="w-full max-w-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-6 px-12 text-xl shadow-lg"
          >
            <Download className="w-6 h-6 mr-3" />
            {hasDownloaded ? "Download Again" : "Download Now"}
          </Button>

          <div className="border-t border-white/10 pt-8 space-y-3 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Stay Updated with The Islamic Renaissance</h3>
            </div>
            <p className="text-sm text-gray-400">
              Please check your email to verify your subscription to our newsletter
            </p>
          </div>
        </div>
      </div>

      {showConfetti && <ConfettiEffect />}
    </div>
  )
}

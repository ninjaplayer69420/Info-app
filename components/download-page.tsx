"use client"

import { useEffect, useState } from "react"
import { Download, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfettiEffect } from "./confetti-effect"
import type { Product } from "@/lib/products"

interface DownloadPageProps {
  product: Product
}

export function DownloadPage({ product }: DownloadPageProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasDownloaded, setHasDownloaded] = useState(false)

  useEffect(() => {
    const downloaded = localStorage.getItem(`downloaded-${product.id}`)
    if (downloaded) {
      setHasDownloaded(true)
    }
  }, [product.id])

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement("a")
    link.href = product.downloadUrl
    link.download = `${product.title}.pdf`
    link.click()

    setShowConfetti(true)
    setHasDownloaded(true)
    localStorage.setItem(`downloaded-${product.id}`, "true")

    // Update sales count
    fetch("/api/track-download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: product.id }),
    })
  }

  return (
    <div className="container mx-auto px-4 pt-24 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card shine-border rounded-3xl p-12 text-center space-y-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center shine-border">
            {hasDownloaded ? (
              <CheckCircle className="w-10 h-10 text-green-400" />
            ) : (
              <Download className="w-10 h-10 text-white" />
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white mb-4 glow-text">
              {hasDownloaded ? "Download Complete!" : "Ready to Download"}
            </h1>
            <h2 className="text-xl font-medium text-gray-300 mb-4">{product.title}</h2>
            <p className="text-gray-400">
              {hasDownloaded
                ? "Your download is complete! You can download it again anytime."
                : "Click the button below to download your product."}
            </p>
          </div>

          <Button
            onClick={handleDownload}
            size="lg"
            className="bg-white text-black hover:bg-white font-medium py-4 px-8 text-lg shine-border"
          >
            <Download className="w-5 h-5 mr-2" />
            {hasDownloaded ? "Download Again" : "Download Now"}
          </Button>

          <div className="border-t border-white/10 pt-8 space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Stay Updated with Islamic Excellence</h3>
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

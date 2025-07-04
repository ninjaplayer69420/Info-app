"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"

interface EmailFormProps {
  productId: string
  productTitle: string
  onEmailSubmitted: (email: string) => void
}

export function EmailForm({ productId, productTitle, onEmailSubmitted }: EmailFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Create hidden form to submit directly to Substack (exactly like your HTML)
      const hiddenForm = document.createElement("form")
      hiddenForm.method = "POST"
      hiddenForm.action = "https://islamicexcellence.substack.com/api/v1/free"
      hiddenForm.target = "hidden_iframe"
      hiddenForm.style.display = "none"

      const emailInput = document.createElement("input")
      emailInput.type = "email"
      emailInput.name = "email"
      emailInput.value = email

      hiddenForm.appendChild(emailInput)
      document.body.appendChild(hiddenForm)

      // Submit to Substack
      hiddenForm.submit()

      // Clean up
      document.body.removeChild(hiddenForm)

      // Also save to our database for admin tracking
      try {
        await fetch("/api/subscribers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, productId }),
        })
      } catch (dbError) {
        console.error("Error saving to database:", dbError)
        // Don't fail the whole process if database save fails
      }

      // Call the callback to proceed to download
      localStorage.setItem(`user-email-${productId}`, email)
      onEmailSubmitted(email)
    } catch (error) {
      console.error("Error submitting email:", error)
      alert("There was an error. Please try again.")
    } finally {
      setTimeout(() => {
        setIsSubmitting(false)
      }, 2000)
    }
  }

  return (
    <div className="text-center space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 glow-text">Get Your Free Download</h3>
        <p className="text-gray-400 text-sm">Enter your email to get instant access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:ring-white/20 h-14 text-lg"
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-4 text-lg shine-border shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Get Download Link
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-gray-500">
        By downloading, you'll be subscribed to our newsletter with exclusive content and updates.
      </p>

      {/* Hidden iframe for Substack submission (exactly like your HTML) */}
      <iframe
        ref={hiddenIframeRef}
        name="hidden_iframe"
        style={{ display: "none" }}
        title="Hidden iframe for form submission"
      />
    </div>
  )
}

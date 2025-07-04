"use client"

import { useEffect, useState } from "react"

export function ConfettiEffect() {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      color: string
      size: number
      speedX: number
      speedY: number
    }>
  >([])

  useEffect(() => {
    const colors = ["#ffffff", "#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd"]
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 6,
      speedX: (Math.random() - 0.5) * 6,
      speedY: Math.random() * 4 + 3,
    }))

    setParticles(newParticles)

    const timer = setTimeout(() => {
      setParticles([])
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.speedX,
            y: particle.y + particle.speedY,
            speedY: particle.speedY + 0.15, // gravity
          }))
          .filter((particle) => particle.y < window.innerHeight + 20),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [particles.length])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-90"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
          }}
        />
      ))}
    </div>
  )
}

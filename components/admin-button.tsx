"use client"
import { useState } from "react"
import { AdminPanel } from "./admin-panel"

export function AdminButton() {
  const [showLogin, setShowLogin] = useState(false)
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (password1 === "wEnS};i#=w" && password2 === "S{!h]OcI_h") {
      setIsAdmin(true)
      setShowLogin(false)
      setError("")
      // Remember admin status on device
      localStorage.setItem("site-admin", "true")
    } else {
      setError("Invalid passwords")
      setPassword1("")
      setPassword2("")
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem("site-admin")
  }

  // Check if already admin on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const adminStatus = localStorage.getItem("site-admin")
      if (adminStatus === "true") {
        setIsAdmin(true)
      }
    }
  })

  if (isAdmin) {
    return <AdminPanel onLogout={handleLogout} />
  }

  return (
    <>
      {/* HIDDEN TRANSPARENT BUTTON - TOP LEFT */}
      <div
        onClick={() => setShowLogin(true)}
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          width: "50px",
          height: "50px",
          backgroundColor: "transparent",
          cursor: "pointer",
          zIndex: 99999,
          opacity: 0,
        }}
      />

      {/* LOGIN POPUP */}
      {showLogin && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
          }}
        >
          <div
            style={{
              backgroundColor: "#1f2937",
              padding: "32px",
              borderRadius: "12px",
              border: "2px solid #374151",
              minWidth: "400px",
            }}
          >
            <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
              Admin Access Required
            </h2>

            {error && (
              <div
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              >
                <p style={{ color: "#fca5a5", fontSize: "14px" }}>{error}</p>
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "8px" }}
              >
                Password 1
              </label>
              <input
                type="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "2px solid #4b5563",
                  borderRadius: "8px",
                  color: "white",
                  outline: "none",
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "8px" }}
              >
                Password 2
              </label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "2px solid #4b5563",
                  borderRadius: "8px",
                  color: "white",
                  outline: "none",
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleLogin}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowLogin(false)
                  setPassword1("")
                  setPassword2("")
                  setError("")
                }}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

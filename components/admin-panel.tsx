"use client"
import { useState, useEffect } from "react"
import { X, Plus, Edit, Trash2, Save, Download, FolderSyncIcon as Sync, Mail, Users } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  price: number
  downloadUrl: string
  salesCount: number
}

interface Review {
  id: string
  productId: string
  userEmail: string
  score: number
  comment: string
  createdAt: string
}

interface Subscriber {
  id: string
  email: string
  productId: string
  subscribedAt: string
  substackSynced: boolean
  syncAttempts: number
  lastSyncAttempt: string
  syncError: string
  source: string
}

interface AdminPanelProps {
  onLogout: () => void
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"products" | "reviews" | "subscribers" | "settings">("products")
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [syncStats, setSyncStats] = useState<{ processed: number; successful: number; failed: number } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load products
      const productsRes = await fetch("/api/admin/products")
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      // Load all reviews
      const reviewsRes = await fetch("/api/admin/reviews")
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData)
      }

      // Load subscribers
      const subscribersRes = await fetch("/api/admin/subscribers")
      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json()
        setSubscribers(subscribersData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveProduct = async (product: Product) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })

      if (response.ok) {
        setMessage("Product saved successfully!")
        loadData()
        setEditingProduct(null)
        setShowAddProduct(false)
      } else {
        setMessage("Error saving product")
      }
    } catch (error) {
      setMessage("Error saving product")
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage("Product deleted successfully!")
        loadData()
      } else {
        setMessage("Error deleting product")
      }
    } catch (error) {
      setMessage("Error deleting product")
    }
  }

  const saveReview = async (review: Review) => {
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      })

      if (response.ok) {
        setMessage("Review saved successfully!")
        loadData()
        setEditingReview(null)
      } else {
        setMessage("Error saving review")
      }
    } catch (error) {
      setMessage("Error saving review")
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage("Review deleted successfully!")
        loadData()
      } else {
        setMessage("Error deleting review")
      }
    } catch (error) {
      setMessage("Error deleting review")
    }
  }

  const deleteSubscriber = async (email: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return

    try {
      const response = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage("Subscriber deleted successfully!")
        loadData()
      } else {
        setMessage("Error deleting subscriber")
      }
    } catch (error) {
      setMessage("Error deleting subscriber")
    }
  }

  const syncToSubstack = async () => {
    if (!confirm("This will attempt to sync all pending subscribers to Substack. Continue?")) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/subscribers/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync-all" }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
        setSyncStats(data.stats)
        loadData()
      } else {
        setMessage("Error syncing to Substack")
      }
    } catch (error) {
      setMessage("Error syncing to Substack")
    } finally {
      setLoading(false)
    }
  }

  const exportSubscribers = async () => {
    try {
      const response = await fetch("/api/admin/subscribers?format=csv")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        setMessage("Subscribers exported successfully!")
      } else {
        setMessage("Error exporting subscribers")
      }
    } catch (error) {
      setMessage("Error exporting subscribers")
    }
  }

  const pendingCount = subscribers.filter((s) => !s.substackSynced).length
  const syncedCount = subscribers.filter((s) => s.substackSynced).length

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        zIndex: 100000,
        overflow: "auto",
      }}
    >
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            borderBottom: "2px solid #374151",
            paddingBottom: "16px",
          }}
        >
          <h1 style={{ color: "white", fontSize: "32px", fontWeight: "bold" }}>🔧 Site Admin Panel</h1>
          <button
            onClick={onLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <X className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.2)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <p style={{ color: "#86efac", fontSize: "14px" }}>{message}</p>
          </div>
        )}

        {/* SYNC STATS */}
        {syncStats && (
          <div
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <p style={{ color: "#93c5fd", fontSize: "14px" }}>
              Sync Results: {syncStats.processed} processed, {syncStats.successful} successful, {syncStats.failed}{" "}
              failed
            </p>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
          {["products", "reviews", "subscribers", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                padding: "12px 24px",
                backgroundColor: activeTab === tab ? "#2563eb" : "#374151",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                textTransform: "capitalize",
                fontWeight: activeTab === tab ? "600" : "400",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {tab === "products" && <Plus className="w-4 h-4" />}
              {tab === "reviews" && <Edit className="w-4 h-4" />}
              {tab === "subscribers" && <Users className="w-4 h-4" />}
              {tab === "settings" && <Save className="w-4 h-4" />}
              {tab}
              {tab === "subscribers" && pendingCount > 0 && (
                <span
                  style={{
                    backgroundColor: "#dc2626",
                    color: "white",
                    fontSize: "12px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}
            >
              <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>Products Management</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* PRODUCTS LIST */}
            <div style={{ display: "grid", gap: "16px" }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: "#1f2937",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #374151",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                        {product.title}
                      </h3>
                      <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "8px" }}>{product.description}</p>
                      <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#6b7280" }}>
                        <span>Price: ${product.price}</span>
                        <span>Sales: {product.salesCount}</span>
                        <span>ID: {product.id}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setEditingProduct(product)}
                        style={{
                          padding: "8px",
                          backgroundColor: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        style={{
                          padding: "8px",
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div>
            <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
              Reviews Management
            </h2>

            <div style={{ display: "grid", gap: "16px" }}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    backgroundColor: "#1f2937",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #374151",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <div style={{ color: "#fbbf24" }}>
                          {"⭐".repeat(review.score)}
                          {"☆".repeat(5 - review.score)}
                        </div>
                        <span style={{ color: "#9ca3af", fontSize: "14px" }}>by {review.userEmail}</span>
                      </div>
                      <p style={{ color: "white", marginBottom: "8px" }}>{review.comment}</p>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Product: {review.productId} | Date: {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setEditingReview(review)}
                        style={{
                          padding: "8px",
                          backgroundColor: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteReview(review.id)}
                        style={{
                          padding: "8px",
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBSCRIBERS TAB */}
        {activeTab === "subscribers" && (
          <div>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}
            >
              <div>
                <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>Email Subscribers</h2>
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                  Total: {subscribers.length} | Synced: {syncedCount} | Pending: {pendingCount}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={exportSubscribers}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={syncToSubstack}
                  disabled={loading || pendingCount === 0}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: loading || pendingCount === 0 ? "#6b7280" : "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loading || pendingCount === 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Sync className="w-4 h-4" />
                  {loading ? "Syncing..." : `Sync to Substack (${pendingCount})`}
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  style={{
                    backgroundColor: "#1f2937",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #374151",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                        <span style={{ color: "white", fontWeight: "500" }}>{subscriber.email}</span>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            backgroundColor: subscriber.substackSynced ? "#059669" : "#dc2626",
                            color: "white",
                          }}
                        >
                          {subscriber.substackSynced ? "Synced" : "Pending"}
                        </span>
                        {subscriber.syncError && (
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              backgroundColor: "#dc2626",
                              color: "white",
                            }}
                          >
                            Error
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Product: {subscriber.productId || "N/A"} | Subscribed:{" "}
                        {new Date(subscriber.subscribedAt).toLocaleDateString()} | Attempts: {subscriber.syncAttempts}
                        {subscriber.syncError && ` | Error: ${subscriber.syncError}`}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSubscriber(subscriber.email)}
                      style={{
                        padding: "6px",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div>
            <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
              Site Settings
            </h2>
            <div
              style={{
                backgroundColor: "#1f2937",
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid #374151",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
                📧 Substack Integration
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
                Newsletter URL: https://substack.com/@islamicexcellence
              </p>
              <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
                Emails are automatically collected and can be synced to your Substack newsletter. Use the "Sync to
                Substack" button in the Subscribers tab to process pending emails.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => window.open("https://substack.com/@islamicexcellence", "_blank")}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Open Substack
                </button>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#1f2937",
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid #374151",
              }}
            >
              <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
                🛠️ System Tools
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "16px" }}>Site administration tools and global settings.</p>
              <button
                onClick={() => {
                  if (confirm("Clear all cached data and reload?")) {
                    localStorage.clear()
                    window.location.reload()
                  }
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT EDIT MODAL */}
      {(editingProduct || showAddProduct) && (
        <ProductEditModal
          product={editingProduct}
          onSave={saveProduct}
          onClose={() => {
            setEditingProduct(null)
            setShowAddProduct(false)
          }}
        />
      )}

      {/* REVIEW EDIT MODAL */}
      {editingReview && (
        <ReviewEditModal review={editingReview} onSave={saveReview} onClose={() => setEditingReview(null)} />
      )}
    </div>
  )
}

// PRODUCT EDIT MODAL
function ProductEditModal({
  product,
  onSave,
  onClose,
}: {
  product: Product | null
  onSave: (product: Product) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: "",
      title: "",
      description: "",
      longDescription: "",
      image: "",
      price: 0,
      downloadUrl: "",
      salesCount: 0,
    },
  )

  return (
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
        zIndex: 100001,
        overflow: "auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#1f2937",
          padding: "24px",
          borderRadius: "12px",
          border: "2px solid #374151",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <h3 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          {product ? "Edit Product" : "Add New Product"}
        </h3>

        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label
              style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
            >
              Product ID
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid #4b5563",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div>
            <label
              style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
            >
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid #4b5563",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div>
            <label
              style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid #4b5563",
                borderRadius: "4px",
                color: "white",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label
              style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
            >
              Long Description
            </label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={6}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid #4b5563",
                borderRadius: "4px",
                color: "white",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label
                style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
              >
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid #4b5563",
                  borderRadius: "4px",
                  color: "white",
                }}
              />
            </div>

            <div>
              <label
                style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
              >
                Sales Count
              </label>
              <input
                type="number"
                value={formData.salesCount}
                onChange={(e) => setFormData({ ...formData, salesCount: Number(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid #4b5563",
                  borderRadius: "4px",
                  color: "white",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
            >
              Image URL
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid #4b5563",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div>
            <label
              style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
            >
              Download URL
            </label>
            <input
              type="text"
              value={formData.downloadUrl}
              onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid #4b5563",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={() => onSave(formData)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#059669",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Save className="w-4 h-4" />
            Save Product
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// REVIEW EDIT MODAL
function ReviewEditModal({
  review,
  onSave,
  onClose,
}: {
  review: Review
  onSave: (review: Review) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState<Review>(review)

  return (
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
        zIndex: 100001,
      }}
    >
      <div
        style={{
          backgroundColor: "#1f2937",
          padding: "24px",
          borderRadius: "12px",
          border: "2px solid #374151",
          width: "90%",
          maxWidth: "500px",
        }}
      >
        <h3 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Edit Review</h3>

        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label
              style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
            >
              User Email
            </label>
            <input
              type="email"
              value={formData.userEmail}
              onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid #4b5563",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div>
            <label
              style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
            >
              Rating (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid #4b5563",
                borderRadius: "4px",
                color: "white",
              }}
            />
          </div>

          <div>
            <label
              style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}
            >
              Comment
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid #4b5563",
                borderRadius: "4px",
                color: "white",
                resize: "vertical",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={() => onSave(formData)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#059669",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Save className="w-4 h-4" />
            Save Review
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

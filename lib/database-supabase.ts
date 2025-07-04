import { supabase, type DatabaseRating } from "./supabase"

export const database = {
  // Products
  getProducts: async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return data || []
  },

  getProduct: async (id: string) => {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      return null
    }

    return data
  },

  updateProductSalesCount: async (id: string) => {
    const { data, error } = await supabase
      .from("products")
      .update({
        sales_count: supabase.raw("sales_count + 1"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating sales count:", error)
      return null
    }

    return data
  },

  // Ratings
  getRatings: async (productId: string) => {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching ratings:", error)
      return []
    }

    return data || []
  },

  addRating: async (rating: Omit<DatabaseRating, "id" | "created_at">) => {
    const { data, error } = await supabase.from("ratings").insert([rating]).select().single()

    if (error) {
      console.error("Error adding rating:", error)
      throw error
    }

    return data
  },

  getRatingAverage: async (productId: string) => {
    const { data, error } = await supabase.from("ratings").select("score").eq("product_id", productId)

    if (error) {
      console.error("Error fetching rating average:", error)
      return 0
    }

    if (!data || data.length === 0) return 0

    const sum = data.reduce((acc, rating) => acc + rating.score, 0)
    return sum / data.length
  },

  getRatingStats: async (productId: string) => {
    const { data, error } = await supabase.from("ratings").select("score").eq("product_id", productId)

    if (error) {
      console.error("Error fetching rating stats:", error)
      return { average: 0, count: 0 }
    }

    if (!data || data.length === 0) {
      return { average: 0, count: 0 }
    }

    const sum = data.reduce((acc, rating) => acc + rating.score, 0)
    return {
      average: sum / data.length,
      count: data.length,
    }
  },

  // Check if user has already rated a product
  hasUserRated: async (productId: string, userEmail: string) => {
    const { data, error } = await supabase
      .from("ratings")
      .select("id")
      .eq("product_id", productId)
      .eq("user_email", userEmail)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking user rating:", error)
      return false
    }

    return !!data
  },
}

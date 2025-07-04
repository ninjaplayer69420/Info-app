import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database
export interface DatabaseProduct {
  id: string
  title: string
  description: string
  long_description: string
  image: string
  price: number
  download_url: string
  sales_count: number
  created_at: string
  updated_at: string
}

export interface DatabaseRating {
  id: string
  product_id: string
  user_email: string
  score: number
  comment: string
  created_at: string
}

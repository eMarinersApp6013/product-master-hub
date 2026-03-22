export type Plan = 'free' | 'starter' | 'pro' | 'enterprise'

export type User = {
  id: number
  clerk_id: string
  store_name: string | null
  email: string
  plan: Plan
  ai_count: number
  created_at: string
}

export type Product = {
  id: number
  user_id: string
  name: string
  description: string | null
  sku: string | null
  category: string | null
  sub_category: string | null
  mrp: string | null
  selling_price: string | null
  purchase_price: string | null
  wholesale_price: string | null
  weight: string | null
  dimensions: string | null
  seo_keywords: string | null
  hsn_code: string | null
  stock: number
  amazon_link: string | null
  flipkart_link: string | null
  etsy_link: string | null
  meesho_link: string | null
  ai_data: Record<string, unknown> | null
  created_at: string
  // joined
  platforms?: string[]
  images?: ProductImage[]
}

export type ProductImage = {
  id: number
  product_id: number
  user_id: string
  filename: string
  width: number | null
  height: number | null
  size_kb: number | null
  dpi: number | null
  file_url: string | null
  created_at: string
}

export type ProductPlatform = {
  id: number
  product_id: number
  platform_name: string
}

export type StorePolicy = {
  id: number
  user_id: string
  policy_type: string
  content: string | null
  updated_at: string
}

export type SocialLink = {
  id: number
  user_id: string
  platform: string
  url: string | null
}

export type DashboardStats = {
  total_products: number
  total_revenue: number
  low_stock: number
  ai_calls_month: number
}

import { z } from 'zod'

// Product categories for sustainability classification
export type ProductCategory = 
  | 'Meat' 
  | 'Dairy' 
  | 'Produce' 
  | 'Grains' 
  | 'Clothing' 
  | 'Electronics' 
  | 'Home Goods' 
  | 'Automotive' 
  | 'Energy' 
  | 'Transportation'

// Main product interface
export interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  carbonIntensity: number // kg CO2e per unit
  isOrganic: boolean
  category: ProductCategory
  brand?: string
  rating?: number
  reviewCount?: number
  inStock: boolean
  sustainabilityScore: number // 0-100 calculated score
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Product recommendation interface for AI suggestions
export interface ProductRecommendation extends Product {
  comparison: string // AI-generated comparison text
  ecoCreds: number // Points earned for choosing this alternative
  carbonSavings: number // CO2e saved compared to original
  reasonForRecommendation: string
}

// Product filter interface for search and filtering
export interface ProductFilters {
  category?: ProductCategory[]
  priceRange?: {
    min: number
    max: number
  }
  sustainabilityScore?: {
    min: number
    max: number
  }
  isOrganic?: boolean
  inStock?: boolean
  tags?: string[]
  search?: string
}

// Product sort options
export type ProductSortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'sustainability-asc'
  | 'sustainability-desc'
  | 'carbon-asc'
  | 'carbon-desc'
  | 'rating-desc'
  | 'newest'

// Validation schemas
export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  image: z.string().url('Invalid image URL'),
  price: z.number().positive('Price must be positive'),
  carbonIntensity: z.number().nonnegative('Carbon intensity cannot be negative'),
  isOrganic: z.boolean(),
  category: z.enum(['Meat', 'Dairy', 'Produce', 'Grains', 'Clothing', 'Electronics', 'Home Goods', 'Automotive', 'Energy', 'Transportation']),
  brand: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().nonnegative().optional(),
  inStock: z.boolean(),
  sustainabilityScore: z.number().min(0).max(100),
  tags: z.array(z.string()),
})

// Cart item interface
export interface CartItem {
  product: Product
  quantity: number
  addedAt: Date
  isSustainableSwap?: boolean
  originalProductId?: string // If this is a swap recommendation
}

// Shopping cart interface
export interface ShoppingCart {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  totalCarbonFootprint: number
  potentialEcoCredits: number
  createdAt: Date
  updatedAt: Date
}

// Product analytics for sustainability insights
export interface ProductAnalytics {
  totalProducts: number
  averageCarbonIntensity: number
  organicPercentage: number
  categoryDistribution: Record<ProductCategory, number>
  sustainabilityTrends: {
    month: string
    averageScore: number
    organicCount: number
  }[]
}
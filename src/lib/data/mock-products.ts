import { Product, ProductCategory } from '@/lib/types/product'
import { calculateSustainabilityScore } from '@/lib/utils'

// Mock product data for development and demonstration
export const mockProducts: Product[] = [
  // Produce Category
  {
    id: 'prod-001',
    name: 'Organic Avocados',
    description: 'Fresh, creamy organic avocados grown using sustainable farming practices. Perfect for toast, salads, or guacamole.',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop',
    price: 4.99,
    carbonIntensity: 0.8,
    isOrganic: true,
    category: 'Produce' as ProductCategory,
    brand: 'Green Valley Farms',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    sustainabilityScore: 85,
    tags: ['organic', 'local', 'sustainable', 'healthy'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'prod-002',
    name: 'Conventional Bananas',
    description: 'Sweet, ripe bananas imported from tropical regions. Great source of potassium and natural energy.',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    price: 2.49,
    carbonIntensity: 2.1,
    isOrganic: false,
    category: 'Produce' as ProductCategory,
    brand: 'Tropical Imports',
    rating: 4.0,
    reviewCount: 89,
    inStock: true,
    sustainabilityScore: 45,
    tags: ['imported', 'affordable', 'energy'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'prod-003',
    name: 'Local Organic Spinach',
    description: 'Fresh, nutrient-rich organic spinach grown locally. Packed with iron, vitamins, and minerals.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
    price: 3.99,
    carbonIntensity: 0.3,
    isOrganic: true,
    category: 'Produce' as ProductCategory,
    brand: 'Local Harvest Co.',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    sustainabilityScore: 95,
    tags: ['organic', 'local', 'superfood', 'iron-rich'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
  },

  // Grains Category
  {
    id: 'prod-004',
    name: 'Organic Quinoa',
    description: 'Premium organic quinoa, a complete protein source. Sustainably sourced from South American farmers.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    price: 8.99,
    carbonIntensity: 1.2,
    isOrganic: true,
    category: 'Grains' as ProductCategory,
    brand: 'Ancient Grains Co.',
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
    sustainabilityScore: 78,
    tags: ['organic', 'protein', 'gluten-free', 'superfood'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'prod-005',
    name: 'Conventional White Rice',
    description: 'Long-grain white rice, a pantry staple. Versatile and affordable for everyday meals.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    price: 3.49,
    carbonIntensity: 3.8,
    isOrganic: false,
    category: 'Grains' as ProductCategory,
    brand: 'Staple Foods Inc.',
    rating: 3.8,
    reviewCount: 67,
    inStock: true,
    sustainabilityScore: 35,
    tags: ['affordable', 'staple', 'versatile'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
  },

  // Dairy Category
  {
    id: 'prod-006',
    name: 'Organic Almond Milk',
    description: 'Creamy, unsweetened organic almond milk. A sustainable plant-based alternative to dairy milk.',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
    price: 4.49,
    carbonIntensity: 0.7,
    isOrganic: true,
    category: 'Dairy' as ProductCategory,
    brand: 'Plant Pure',
    rating: 4.4,
    reviewCount: 312,
    inStock: true,
    sustainabilityScore: 82,
    tags: ['organic', 'plant-based', 'dairy-free', 'sustainable'],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'prod-007',
    name: 'Conventional Whole Milk',
    description: 'Fresh whole milk from local dairy farms. Rich in calcium and protein for strong bones.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
    price: 3.99,
    carbonIntensity: 4.2,
    isOrganic: false,
    category: 'Dairy' as ProductCategory,
    brand: 'Dairy Fresh',
    rating: 4.1,
    reviewCount: 145,
    inStock: true,
    sustainabilityScore: 28,
    tags: ['calcium', 'protein', 'local'],
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-15'),
  },

  // Clothing Category
  {
    id: 'prod-008',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, comfortable t-shirt made from 100% organic cotton. Ethically produced with fair trade practices.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    price: 24.99,
    carbonIntensity: 5.1,
    isOrganic: true,
    category: 'Clothing' as ProductCategory,
    brand: 'Eco Threads',
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    sustainabilityScore: 72,
    tags: ['organic', 'fair-trade', 'comfortable', 'ethical'],
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: 'prod-009',
    name: 'Fast Fashion Polyester Shirt',
    description: 'Trendy polyester shirt with modern design. Affordable fashion for everyday wear.',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=300&fit=crop',
    price: 12.99,
    carbonIntensity: 12.8,
    isOrganic: false,
    category: 'Clothing' as ProductCategory,
    brand: 'Quick Fashion',
    rating: 3.2,
    reviewCount: 234,
    inStock: true,
    sustainabilityScore: 15,
    tags: ['affordable', 'trendy', 'synthetic'],
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-13'),
  },

  // Electronics Category
  {
    id: 'prod-010',
    name: 'Refurbished Laptop',
    description: 'High-performance refurbished laptop with warranty. Sustainable choice that reduces electronic waste.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    price: 599.99,
    carbonIntensity: 45.2,
    isOrganic: false,
    category: 'Electronics' as ProductCategory,
    brand: 'GreenTech Refurb',
    rating: 4.3,
    reviewCount: 167,
    inStock: true,
    sustainabilityScore: 68,
    tags: ['refurbished', 'warranty', 'sustainable', 'performance'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'prod-011',
    name: 'New Gaming Laptop',
    description: 'Latest gaming laptop with high-end graphics and processing power. Perfect for gaming and creative work.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
    price: 1299.99,
    carbonIntensity: 156.7,
    isOrganic: false,
    category: 'Electronics' as ProductCategory,
    brand: 'GameMax Pro',
    rating: 4.6,
    reviewCount: 298,
    inStock: true,
    sustainabilityScore: 22,
    tags: ['gaming', 'high-performance', 'new', 'graphics'],
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-10'),
  },

  // Home Goods Category
  {
    id: 'prod-012',
    name: 'Bamboo Kitchen Utensils Set',
    description: 'Eco-friendly bamboo kitchen utensils set. Sustainable alternative to plastic utensils.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    price: 19.99,
    carbonIntensity: 2.1,
    isOrganic: true,
    category: 'Home Goods' as ProductCategory,
    brand: 'Bamboo Living',
    rating: 4.5,
    reviewCount: 178,
    inStock: true,
    sustainabilityScore: 88,
    tags: ['bamboo', 'eco-friendly', 'sustainable', 'kitchen'],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-20'),
  },
]

// Calculate sustainability scores for all products
mockProducts.forEach(product => {
  product.sustainabilityScore = calculateSustainabilityScore(
    product.carbonIntensity,
    product.isOrganic,
    product.category
  )
})

// Helper functions for working with mock data
export function getProductById(id: string): Product | undefined {
  return mockProducts.find(product => product.id === id)
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return mockProducts.filter(product => product.category === category)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getTopSustainableProducts(limit: number = 6): Product[] {
  return [...mockProducts]
    .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
    .slice(0, limit)
}

export function getProductRecommendations(productId: string, limit: number = 3): Product[] {
  const product = getProductById(productId)
  if (!product) return []

  // Find products in the same category with higher sustainability scores
  return mockProducts
    .filter(p => 
      p.id !== productId && 
      p.category === product.category && 
      p.sustainabilityScore > product.sustainabilityScore
    )
    .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
    .slice(0, limit)
}
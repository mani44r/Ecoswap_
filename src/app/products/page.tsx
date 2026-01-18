'use client'

import { useState } from 'react'
import { ProductGrid } from '@/components/product/product-grid'
import { Card, CardContent } from '@/components/ui/card'
import { mockProducts } from '@/lib/data/mock-products'
import { Product } from '@/lib/types/product'

export default function ProductsPage() {
  const [notification, setNotification] = useState<string | null>(null)

  const handleAddToCart = (product: Product) => {
    // TODO: Implement actual cart functionality
    setNotification(`Added "${product.name}" to cart!`)
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <div className="bg-gradient-eco min-h-screen">
      <div className="container py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Sustainable Products
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Discover eco-friendly alternatives and make sustainable choices. 
            Every purchase helps build a greener future.
          </p>
        </div>

        {/* Sustainability Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="eco">
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {mockProducts.length}
              </div>
              <div className="text-sm text-secondary-600">Products Available</div>
            </CardContent>
          </Card>
          
          <Card variant="eco">
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {mockProducts.filter(p => p.isOrganic).length}
              </div>
              <div className="text-sm text-secondary-600">Organic Options</div>
            </CardContent>
          </Card>
          
          <Card variant="eco">
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {Math.round(mockProducts.reduce((sum, p) => sum + p.sustainabilityScore, 0) / mockProducts.length)}
              </div>
              <div className="text-sm text-secondary-600">Avg. Sustainability Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Notification */}
        {notification && (
          <div className="fixed top-20 right-4 bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
            {notification}
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid
          products={mockProducts}
          onAddToCart={handleAddToCart}
          title="All Products"
          showFilters={true}
          showSearch={true}
        />
      </div>
    </div>
  )
}
'use client'

import { ProductGrid } from '@/components/product/product-grid'
import { Card, CardContent } from '@/components/ui/card'
import { mockProducts } from '@/lib/data/mock-products'

export default function ProductsPage() {
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

        {/* Product Grid */}
        <ProductGrid
          products={mockProducts}
          title="All Products"
          showFilters={true}
          showSearch={true}
        />
      </div>
    </div>
  )
}
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductGrid } from '@/components/product/product-grid'
import { mockProducts, getTopSustainableProducts } from '@/lib/data/mock-products'

export default function HomePage() {
  const featuredProducts = getTopSustainableProducts(4)

  return (
    <div className="bg-gradient-eco">
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 text-balance">
            Shop Sustainably with{' '}
            <span className="text-primary-600">AI-Powered</span>{' '}
            Recommendations
          </h1>
          <p className="text-xl text-secondary-600 mb-8 text-balance max-w-2xl mx-auto">
            Discover eco-friendly alternatives, track your carbon footprint, and earn rewards 
            for making sustainable choices. Building a greener future, one purchase at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-base">
                Start Shopping Sustainably
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-base">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            How EcoSwap Works
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Our AI-powered platform makes sustainable shopping effortless and rewarding
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="eco" className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Smart algorithms analyze product sustainability metrics to suggest eco-friendly alternatives
              </CardDescription>
            </CardHeader>
          </Card>

          <Card variant="eco" className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <CardTitle>Carbon Tracking</CardTitle>
              <CardDescription>
                Monitor your environmental impact with detailed carbon footprint analysis for every purchase
              </CardDescription>
            </CardHeader>
          </Card>

          <Card variant="eco" className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <CardTitle>Eco Credits</CardTitle>
              <CardDescription>
                Earn points for sustainable choices and unlock rewards in our gamified green shopping experience
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Featured Sustainable Products
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Discover our top-rated eco-friendly products with the highest sustainability scores
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProductGrid
            products={featuredProducts}
            showFilters={false}
            showSearch={false}
          />
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="outline">
              View All Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-16">
        <Card className="text-center">
          <CardContent className="py-12">
            <h3 className="text-2xl font-bold text-secondary-900 mb-8">
              Making a Real Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">{mockProducts.length}+</div>
                <div className="text-sm text-secondary-600">Sustainable Products</div>
                <div className="text-xs text-secondary-500 mt-1">Curated for you</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {Math.round(mockProducts.reduce((sum, p) => sum + p.sustainabilityScore, 0) / mockProducts.length)}%
                </div>
                <div className="text-sm text-secondary-600">Avg. Sustainability Score</div>
                <div className="text-xs text-secondary-500 mt-1">Above industry standard</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {mockProducts.filter(p => p.isOrganic).length}
                </div>
                <div className="text-sm text-secondary-600">Organic Options</div>
                <div className="text-xs text-secondary-500 mt-1">Certified organic</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card variant="eco" className="text-center">
          <CardContent className="py-12">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Ready to Start Your Sustainable Journey?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              Join the movement towards conscious consumption and help build a more sustainable future.
            </p>
            <Link href="/auth/signup">
              <Button size="lg">
                Get Started Today
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
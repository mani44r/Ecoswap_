import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
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
            <Button size="lg" className="text-base">
              Start Shopping Sustainably
            </Button>
            <Button variant="outline" size="lg" className="text-base">
              Learn More
            </Button>
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

      {/* Stats Section */}
      <section className="container py-16">
        <Card className="text-center">
          <CardContent className="py-12">
            <h3 className="text-2xl font-bold text-secondary-900 mb-8">
              Making a Real Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">🚧</div>
                <div className="text-sm text-secondary-600">Products Analyzed</div>
                <div className="text-xs text-secondary-500 mt-1">Coming Soon</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">🚧</div>
                <div className="text-sm text-secondary-600">CO₂ Saved</div>
                <div className="text-xs text-secondary-500 mt-1">In Development</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">🚧</div>
                <div className="text-sm text-secondary-600">Active Users</div>
                <div className="text-xs text-secondary-500 mt-1">Building MVP</div>
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
            <Button size="lg">
              Get Early Access
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
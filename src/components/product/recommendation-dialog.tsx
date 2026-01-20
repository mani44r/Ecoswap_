'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Product, ProductRecommendation } from '@/lib/types/product'
import { formatCurrency, formatCarbonFootprint } from '@/lib/utils'
import { findSustainableAlternatives } from '@/lib/ai/recommendation-engine'
import { generateRecommendations } from '@/lib/ai/gemini-service'
import { mockProducts } from '@/lib/data/mock-products'

interface RecommendationDialogProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product, isSustainableSwap?: boolean) => void
}

export function RecommendationDialog({
  product,
  isOpen,
  onClose,
  onAddToCart
}: RecommendationDialogProps) {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && product) {
      loadRecommendations()
    }
  }, [isOpen, product])

  const loadRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      // Step 1: Find sustainable alternatives using our algorithm
      const alternatives = findSustainableAlternatives(product, mockProducts)
      
      if (alternatives.length === 0) {
        setError('No sustainable alternatives found for this product.')
        setLoading(false)
        return
      }

      // Step 2: Generate AI-powered recommendations
      const aiResponse = await generateRecommendations({
        originalProduct: product,
        alternatives
      })

      setRecommendations(aiResponse.recommendations)
    } catch (err) {
      console.error('Error loading recommendations:', err)
      setError('Failed to load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddOriginal = () => {
    onAddToCart(product, false)
    onClose()
  }

  const handleAddAlternative = (recommendation: ProductRecommendation) => {
    onAddToCart(recommendation, true)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">
                🌱 Sustainable Alternatives
              </h2>
              <p className="text-secondary-600 mt-1">
                We found better eco-friendly options for you
              </p>
            </div>
            <Button variant="ghost" onClick={onClose} className="shrink-0">
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Original Product */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">
              Your Selected Product
            </h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-900">{product.name}</h4>
                    <p className="text-sm text-secondary-600 mt-1">{product.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="font-medium">{formatCurrency(product.price)}</span>
                      <span className="text-secondary-500">•</span>
                      <span>{formatCarbonFootprint(product.carbonIntensity)}</span>
                      <span className="text-secondary-500">•</span>
                      <span>Sustainability: {product.sustainabilityScore}/100</span>
                    </div>
                  </div>
                  <Button onClick={handleAddOriginal} variant="outline">
                    Add Original
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-secondary-600">Finding sustainable alternatives...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                No Alternatives Found
              </h3>
              <p className="text-secondary-600 mb-4">{error}</p>
              <Button onClick={handleAddOriginal}>
                Add Original Product
              </Button>
            </div>
          )}

          {/* Recommendations */}
          {!loading && !error && recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                Recommended Sustainable Alternatives
              </h3>
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <Card key={recommendation.id} variant="eco" className="relative">
                    {/* Sustainability Badge */}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      +{recommendation.ecoCreds} Eco Credits
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={recommendation.image}
                            alt={recommendation.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-secondary-900 text-lg">
                                {recommendation.name}
                              </h4>
                              {recommendation.brand && (
                                <p className="text-sm text-secondary-500">
                                  {recommendation.brand}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-secondary-900">
                                {formatCurrency(recommendation.price)}
                              </div>
                              {recommendation.price !== product.price && (
                                <div className="text-sm text-secondary-500">
                                  {recommendation.price > product.price ? '+' : ''}
                                  {formatCurrency(recommendation.price - product.price)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Sustainability Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                            <div>
                              <div className="text-secondary-600">Carbon Footprint</div>
                              <div className="font-medium text-green-600">
                                {formatCarbonFootprint(recommendation.carbonIntensity)}
                              </div>
                              {recommendation.carbonSavings > 0 && (
                                <div className="text-xs text-green-600">
                                  -{formatCarbonFootprint(recommendation.carbonSavings)} saved
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-secondary-600">Sustainability</div>
                              <div className="font-medium text-green-600">
                                {recommendation.sustainabilityScore}/100
                              </div>
                              <div className="text-xs text-green-600">
                                +{recommendation.sustainabilityScore - product.sustainabilityScore} improvement
                              </div>
                            </div>
                            <div>
                              <div className="text-secondary-600">Organic</div>
                              <div className="font-medium">
                                {recommendation.isOrganic ? '✅ Yes' : '❌ No'}
                              </div>
                            </div>
                            <div>
                              <div className="text-secondary-600">Eco Credits</div>
                              <div className="font-medium text-green-600">
                                +{recommendation.ecoCreds}
                              </div>
                            </div>
                          </div>

                          {/* AI Comparison */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <h5 className="font-medium text-green-800 mb-2">
                              🤖 Why This is Better
                            </h5>
                            <p className="text-sm text-green-700 leading-relaxed">
                              {recommendation.comparison}
                            </p>
                          </div>

                          {/* Action Button */}
                          <Button 
                            onClick={() => handleAddAlternative(recommendation)}
                            className="w-full"
                            size="lg"
                          >
                            Choose This Sustainable Option
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Footer Message */}
              <div className="mt-6 text-center">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-sm text-primary-700">
                    🌱 <strong>Great choice!</strong> By selecting a sustainable alternative, you're helping 
                    reduce environmental impact and earning eco credits for future rewards.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
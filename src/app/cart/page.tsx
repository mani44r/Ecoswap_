'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { formatCurrency, formatCarbonFootprint } from '@/lib/utils'

export default function CartPage() {
  const { 
    items, 
    itemCount, 
    totalPrice, 
    totalCarbonFootprint, 
    potentialEcoCredits,
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart()

  if (itemCount === 0) {
    return (
      <div className="bg-gradient-eco min-h-screen">
        <div className="container py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-secondary-600 mb-8">
              Start shopping for sustainable products to build a greener future.
            </p>
            <Link href="/products">
              <Button size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-eco min-h-screen">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Shopping Cart</h1>
            <p className="text-secondary-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-secondary-900 mb-1">
                            {item.product.name}
                          </h3>
                          {item.product.brand && (
                            <p className="text-sm text-secondary-500 mb-2">
                              {item.product.brand}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-secondary-600">
                            <span>{formatCurrency(item.product.price)}</span>
                            <span>•</span>
                            <span>{formatCarbonFootprint(item.product.carbonIntensity)}</span>
                            {item.product.isOrganic && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 font-medium">Organic</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3 mt-4">
                        <span className="text-sm text-secondary-600">Quantity:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 p-0"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                        <div className="flex-1 text-right">
                          <span className="font-semibold text-secondary-900">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card variant="eco">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>

            {/* Sustainability Impact */}
            <Card variant="eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🌱</span>
                  <span>Sustainability Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Carbon Footprint</span>
                    <span className="font-semibold">
                      {formatCarbonFootprint(totalCarbonFootprint)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Eco Credits</span>
                    <span className="font-semibold text-green-600">
                      +{potentialEcoCredits} points
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Organic Items</span>
                    <span className="font-semibold">
                      {items.filter(item => item.product.isOrganic).length} of {itemCount}
                    </span>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    🎉 Great choices! You're earning <strong>{potentialEcoCredits} eco credits</strong> for 
                    choosing sustainable products.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Link href="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
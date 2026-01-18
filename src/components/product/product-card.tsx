import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Product } from '@/lib/types/product'
import { formatCurrency, formatCarbonFootprint } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  showAddToCart?: boolean
}

export function ProductCard({ product, onAddToCart, showAddToCart = true }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(product)
  }

  const getSustainabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    if (score >= 40) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getSustainabilityLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden rounded-t-xl">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isOrganic && (
              <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Organic
              </span>
            )}
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSustainabilityColor(product.sustainabilityScore)}`}>
              {getSustainabilityLabel(product.sustainabilityScore)}
            </span>
          </div>

          {/* Stock status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-4">
          <div className="space-y-2">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-secondary-500 uppercase tracking-wide">
                {product.brand}
              </p>
            )}

            {/* Product name */}
            <h3 className="font-semibold text-secondary-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-secondary-600 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-secondary-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-secondary-600">
                  ({product.reviewCount})
                </span>
              </div>
            )}

            {/* Sustainability metrics */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary-600">Carbon footprint:</span>
                <span className="font-medium text-secondary-900">
                  {formatCarbonFootprint(product.carbonIntensity)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary-600">Sustainability:</span>
                <span className={`font-medium ${getSustainabilityColor(product.sustainabilityScore).split(' ')[0]}`}>
                  {product.sustainabilityScore}/100
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-secondary-900">
              {formatCurrency(product.price)}
            </span>
            {product.category && (
              <span className="text-xs text-secondary-500 capitalize">
                {product.category}
              </span>
            )}
          </div>

          {showAddToCart && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="shrink-0"
            >
              {product.inStock ? 'Add to Cart' : 'Unavailable'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product, ProductCategory, ProductFilters, ProductSortOption } from '@/lib/types/product'
import { debounce } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
  showFilters?: boolean
  showSearch?: boolean
  title?: string
  emptyMessage?: string
}

export function ProductGrid({ 
  products, 
  onAddToCart, 
  showFilters = true, 
  showSearch = true,
  title,
  emptyMessage = "No products found matching your criteria."
}: ProductGridProps) {
  const [filters, setFilters] = useState<ProductFilters>({})
  const [sortBy, setSortBy] = useState<ProductSortOption>('sustainability-desc')
  const [searchQuery, setSearchQuery] = useState('')

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setFilters(prev => ({ ...prev, search: query }))
    }, 300),
    []
  )

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Apply filters
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query)) ||
        product.brand?.toLowerCase().includes(query)
      )
    }

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(product => filters.category!.includes(product.category))
    }

    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange!.min && 
        product.price <= filters.priceRange!.max
      )
    }

    if (filters.sustainabilityScore) {
      filtered = filtered.filter(product => 
        product.sustainabilityScore >= filters.sustainabilityScore!.min && 
        product.sustainabilityScore <= filters.sustainabilityScore!.max
      )
    }

    if (filters.isOrganic !== undefined) {
      filtered = filtered.filter(product => product.isOrganic === filters.isOrganic)
    }

    if (filters.inStock !== undefined) {
      filtered = filtered.filter(product => product.inStock === filters.inStock)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'sustainability-asc':
          return a.sustainabilityScore - b.sustainabilityScore
        case 'sustainability-desc':
          return b.sustainabilityScore - a.sustainabilityScore
        case 'carbon-asc':
          return a.carbonIntensity - b.carbonIntensity
        case 'carbon-desc':
          return b.carbonIntensity - a.carbonIntensity
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [products, filters, sortBy])

  // Category filter options
  const categories: ProductCategory[] = [
    'Produce', 'Grains', 'Dairy', 'Meat', 'Clothing', 
    'Electronics', 'Home Goods', 'Automotive', 'Energy', 'Transportation'
  ]

  const toggleCategoryFilter = (category: ProductCategory) => {
    setFilters(prev => {
      const currentCategories = prev.category || []
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(c => c !== category)
        : [...currentCategories, category]
      
      return {
        ...prev,
        category: newCategories.length > 0 ? newCategories : undefined
      }
    })
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      {title && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">{title}</h2>
          <p className="text-secondary-600">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </p>
        </div>
      )}

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="space-y-4">
          {/* Search */}
          {showSearch && (
            <div className="max-w-md mx-auto">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-secondary-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-secondary-900">Filters</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              {/* Category filters */}
              <div>
                <h4 className="text-sm font-medium text-secondary-700 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={filters.category?.includes(category) ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => toggleCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.isOrganic === true ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    isOrganic: prev.isOrganic === true ? undefined : true 
                  }))}
                >
                  Organic Only
                </Button>
                <Button
                  variant={filters.inStock === true ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    inStock: prev.inStock === true ? undefined : true 
                  }))}
                >
                  In Stock
                </Button>
              </div>

              {/* Sort options */}
              <div>
                <h4 className="text-sm font-medium text-secondary-700 mb-2">Sort by</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ProductSortOption)}
                  className="w-full max-w-xs px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="sustainability-desc">Sustainability (High to Low)</option>
                  <option value="sustainability-asc">Sustainability (Low to High)</option>
                  <option value="carbon-asc">Carbon Footprint (Low to High)</option>
                  <option value="carbon-desc">Carbon Footprint (High to Low)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                  <option value="rating-desc">Rating (High to Low)</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            No products found
          </h3>
          <p className="text-secondary-600 mb-4">
            {emptyMessage}
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
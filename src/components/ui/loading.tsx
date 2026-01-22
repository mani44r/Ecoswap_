import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-primary-200 border-t-primary-600',
        sizes[size],
        className
      )}
    />
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-secondary-200 rounded animate-pulse"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  )
}

interface ProductCardSkeletonProps {
  count?: number
}

export function ProductCardSkeleton({ count = 1 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-secondary-200 p-4 space-y-4">
          {/* Image skeleton */}
          <div className="w-full h-48 bg-secondary-200 rounded-lg animate-pulse" />
          
          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-secondary-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-secondary-200 rounded animate-pulse w-full" />
            <div className="h-3 bg-secondary-200 rounded animate-pulse w-2/3" />
          </div>
          
          {/* Footer skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-6 bg-secondary-200 rounded animate-pulse w-20" />
            <div className="h-8 bg-secondary-200 rounded animate-pulse w-24" />
          </div>
        </div>
      ))}
    </>
  )
}

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gradient-eco flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-secondary-600">{message}</p>
      </div>
    </div>
  )
}

export function InlineLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <LoadingSpinner className="mx-auto mb-2" />
        {message && <p className="text-sm text-secondary-600">{message}</p>}
      </div>
    </div>
  )
}
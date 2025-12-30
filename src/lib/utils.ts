import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values for display
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format carbon footprint values
 */
export function formatCarbonFootprint(kgCO2e: number): string {
  if (kgCO2e < 1) {
    return `${Math.round(kgCO2e * 1000)}g CO₂e`
  }
  return `${kgCO2e.toFixed(1)}kg CO₂e`
}

/**
 * Calculate sustainability score (0-100)
 */
export function calculateSustainabilityScore(
  carbonIntensity: number,
  isOrganic: boolean,
  category: string
): number {
  let score = 50 // Base score
  
  // Carbon intensity impact (lower is better)
  if (carbonIntensity < 1) score += 30
  else if (carbonIntensity < 3) score += 20
  else if (carbonIntensity < 5) score += 10
  else score -= 10
  
  // Organic bonus
  if (isOrganic) score += 15
  
  // Category bonuses for naturally sustainable categories
  const sustainableCategories = ['Produce', 'Grains']
  if (sustainableCategories.includes(category)) score += 10
  
  return Math.max(0, Math.min(100, score))
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
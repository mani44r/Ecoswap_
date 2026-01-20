import { Product, ProductCategory } from '@/lib/types/product'

export interface SimilarityScore {
  product: Product
  score: number
  reasons: string[]
}

export interface RecommendationCriteria {
  categoryMatch: number
  sustainabilityImprovement: number
  priceRange: number
  organicPreference: boolean
}

/**
 * Find sustainable product alternatives using a two-step algorithm:
 * 1. Semantic Similarity (Top-5)
 * 2. Sustainability Ranking (Top-2)
 */
export function findSustainableAlternatives(
  originalProduct: Product,
  allProducts: Product[],
  criteria: Partial<RecommendationCriteria> = {}
): Product[] {
  // Step 1: Find semantically similar products (Top-5)
  const similarProducts = findSimilarProducts(originalProduct, allProducts, 5)
  
  // Step 2: Rank by sustainability and return Top-2
  const sustainableAlternatives = rankBySustainability(
    originalProduct,
    similarProducts.map(s => s.product),
    2
  )
  
  return sustainableAlternatives
}

/**
 * Step 1: Find semantically similar products using multiple criteria
 */
function findSimilarProducts(
  originalProduct: Product,
  allProducts: Product[],
  limit: number = 5
): SimilarityScore[] {
  const scores: SimilarityScore[] = []

  for (const product of allProducts) {
    // Skip the original product
    if (product.id === originalProduct.id) continue

    const score = calculateSimilarityScore(originalProduct, product)
    
    // Only include meaningful matches (score > 15)
    if (score.score > 15) {
      scores.push(score)
    }
  }

  // Sort by similarity score and return top matches
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Calculate similarity score between two products
 */
function calculateSimilarityScore(original: Product, candidate: Product): SimilarityScore {
  let score = 0
  const reasons: string[] = []

  // Category match (40 points)
  if (original.category === candidate.category) {
    score += 40
    reasons.push('Same category')
  }

  // Description keyword overlap (up to 35 points)
  const keywordScore = calculateKeywordOverlap(original.description, candidate.description)
  score += keywordScore
  if (keywordScore > 10) {
    reasons.push('Similar description')
  }

  // Name word overlap (up to 15 points)
  const nameScore = calculateNameSimilarity(original.name, candidate.name)
  score += nameScore
  if (nameScore > 5) {
    reasons.push('Similar name')
  }

  // Semantic group bonus (up to 10 points)
  const semanticScore = calculateSemanticGroupBonus(original, candidate)
  score += semanticScore
  if (semanticScore > 0) {
    reasons.push('Related product type')
  }

  // Brand similarity (up to 5 points)
  if (original.brand && candidate.brand && original.brand === candidate.brand) {
    score += 5
    reasons.push('Same brand')
  }

  return {
    product: candidate,
    score,
    reasons
  }
}

/**
 * Calculate keyword overlap between descriptions
 */
function calculateKeywordOverlap(desc1: string, desc2: string): number {
  const words1 = extractKeywords(desc1)
  const words2 = extractKeywords(desc2)
  
  const commonWords = words1.filter(word => words2.includes(word))
  const overlapRatio = commonWords.length / Math.max(words1.length, words2.length)
  
  return Math.floor(overlapRatio * 35)
}

/**
 * Calculate name similarity
 */
function calculateNameSimilarity(name1: string, name2: string): number {
  const words1 = name1.toLowerCase().split(/\s+/)
  const words2 = name2.toLowerCase().split(/\s+/)
  
  const commonWords = words1.filter(word => 
    words2.some(w2 => w2.includes(word) || word.includes(w2))
  )
  
  const similarity = commonWords.length / Math.max(words1.length, words2.length)
  return Math.floor(similarity * 15)
}

/**
 * Calculate semantic group bonus for related product types
 */
function calculateSemanticGroupBonus(original: Product, candidate: Product): number {
  const semanticGroups = {
    tomato: ['paste', 'sauce', 'juice', 'ketchup'],
    milk: ['dairy', 'almond', 'oat', 'soy'],
    bread: ['grain', 'wheat', 'flour'],
    apple: ['fruit', 'juice', 'cider'],
    chicken: ['poultry', 'meat', 'protein'],
    rice: ['grain', 'quinoa', 'barley']
  }

  for (const [baseWord, relatedWords] of Object.entries(semanticGroups)) {
    const originalHasBase = original.name.toLowerCase().includes(baseWord)
    const candidateHasRelated = relatedWords.some(word => 
      candidate.name.toLowerCase().includes(word) || 
      candidate.description.toLowerCase().includes(word)
    )
    
    if (originalHasBase && candidateHasRelated) {
      return 10
    }
  }

  return 0
}

/**
 * Extract meaningful keywords from text
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
  ])

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10) // Limit to top 10 keywords
}

/**
 * Step 2: Rank products by sustainability score
 */
function rankBySustainability(
  originalProduct: Product,
  candidates: Product[],
  limit: number = 2
): Product[] {
  const sustainabilityScores = candidates.map(product => ({
    product,
    score: calculateSustainabilityRanking(originalProduct, product)
  }))

  return sustainabilityScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product)
}

/**
 * Calculate sustainability ranking score
 */
function calculateSustainabilityRanking(original: Product, candidate: Product): number {
  let score = 0

  // Carbon reduction vs original (up to 60%)
  const carbonReduction = Math.max(0, original.carbonIntensity - candidate.carbonIntensity)
  const carbonScore = Math.min(60, (carbonReduction / original.carbonIntensity) * 60)
  score += carbonScore

  // Organic bonus (25%)
  if (candidate.isOrganic && !original.isOrganic) {
    score += 25
  }

  // Category bonus for naturally sustainable categories (15%)
  const sustainableCategories: ProductCategory[] = ['Produce', 'Grains']
  if (sustainableCategories.includes(candidate.category)) {
    score += 15
  }

  // Overall sustainability score improvement
  const sustainabilityImprovement = candidate.sustainabilityScore - original.sustainabilityScore
  if (sustainabilityImprovement > 0) {
    score += Math.min(20, sustainabilityImprovement / 5)
  }

  return score
}

/**
 * Get product recommendations with detailed analysis
 */
export function getDetailedRecommendations(
  originalProduct: Product,
  allProducts: Product[]
): {
  alternatives: Product[]
  analysis: {
    totalCandidates: number
    similarityMatches: number
    sustainabilityImprovements: number
    averageScoreImprovement: number
  }
} {
  const alternatives = findSustainableAlternatives(originalProduct, allProducts)
  
  const similarityMatches = findSimilarProducts(originalProduct, allProducts, 10).length
  const sustainabilityImprovements = alternatives.filter(
    alt => alt.sustainabilityScore > originalProduct.sustainabilityScore
  ).length
  
  const averageScoreImprovement = alternatives.length > 0
    ? alternatives.reduce((sum, alt) => sum + (alt.sustainabilityScore - originalProduct.sustainabilityScore), 0) / alternatives.length
    : 0

  return {
    alternatives,
    analysis: {
      totalCandidates: allProducts.length - 1, // Exclude original
      similarityMatches,
      sustainabilityImprovements,
      averageScoreImprovement: Math.round(averageScoreImprovement)
    }
  }
}
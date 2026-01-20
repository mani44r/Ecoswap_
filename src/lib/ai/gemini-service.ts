import { GoogleGenerativeAI } from '@google/generative-ai'
import { Product, ProductRecommendation } from '@/lib/types/product'

// Initialize Gemini AI with fallback for development
const getGeminiAPI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    console.warn('Gemini API key not found. Using mock responses.')
    return null
  }
  return new GoogleGenerativeAI(apiKey)
}

const genAI = getGeminiAPI()

export interface RecommendationRequest {
  originalProduct: Product
  alternatives: Product[]
}

export interface RecommendationResponse {
  recommendations: ProductRecommendation[]
  reasoning: string
}

/**
 * Generate AI-powered product recommendations using Gemini
 */
export async function generateRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  // If no API key, return mock recommendations
  if (!genAI) {
    return generateMockRecommendations(request)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = createRecommendationPrompt(request.originalProduct, request.alternatives)
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the AI response and create recommendations
    return parseAIResponse(text, request.alternatives)
  } catch (error) {
    console.error('Error generating AI recommendations:', error)
    // Fallback to mock recommendations on error
    return generateMockRecommendations(request)
  }
}

/**
 * Create a detailed prompt for Gemini to generate sustainable product recommendations
 */
function createRecommendationPrompt(originalProduct: Product, alternatives: Product[]): string {
  return `
You are an AI sustainability expert helping users make eco-friendly shopping choices. 

ORIGINAL PRODUCT:
- Name: ${originalProduct.name}
- Description: ${originalProduct.description}
- Price: $${originalProduct.price}
- Carbon Intensity: ${originalProduct.carbonIntensity} kg CO₂e
- Organic: ${originalProduct.isOrganic ? 'Yes' : 'No'}
- Sustainability Score: ${originalProduct.sustainabilityScore}/100
- Category: ${originalProduct.category}

ALTERNATIVE PRODUCTS:
${alternatives.map((alt, index) => `
${index + 1}. ${alt.name}
   - Description: ${alt.description}
   - Price: $${alt.price}
   - Carbon Intensity: ${alt.carbonIntensity} kg CO₂e
   - Organic: ${alt.isOrganic ? 'Yes' : 'No'}
   - Sustainability Score: ${alt.sustainabilityScore}/100
   - Category: ${alt.category}
`).join('')}

TASK:
For each alternative product, provide:
1. A compelling 80-120 word comparison explaining why this alternative is more sustainable
2. Calculate eco credits (10-50 points based on sustainability improvement)
3. Calculate carbon savings compared to the original product
4. A brief reason for recommendation (focus on environmental benefits)

Format your response as JSON:
{
  "recommendations": [
    {
      "productId": "product_id",
      "comparison": "compelling comparison text",
      "ecoCreds": number,
      "carbonSavings": number,
      "reasonForRecommendation": "brief reason"
    }
  ],
  "reasoning": "Overall explanation of why these alternatives are better"
}

Focus on:
- Environmental impact reduction
- Sustainability benefits
- Carbon footprint improvements
- Organic/ethical advantages
- Long-term environmental value
`
}

/**
 * Parse AI response and create recommendation objects
 */
function parseAIResponse(aiResponse: string, alternatives: Product[]): RecommendationResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    const recommendations: ProductRecommendation[] = alternatives.map((product, index) => {
      const aiRec = parsed.recommendations?.[index] || {}
      
      return {
        ...product,
        comparison: aiRec.comparison || generateFallbackComparison(product),
        ecoCreds: aiRec.ecoCreds || calculateEcoCredits(product),
        carbonSavings: aiRec.carbonSavings || 0,
        reasonForRecommendation: aiRec.reasonForRecommendation || 'More sustainable choice'
      }
    })

    return {
      recommendations,
      reasoning: parsed.reasoning || 'These alternatives offer better sustainability profiles.'
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    // Fallback to structured recommendations
    return createFallbackRecommendations(alternatives)
  }
}

/**
 * Generate mock recommendations for development/fallback
 */
function generateMockRecommendations(request: RecommendationRequest): RecommendationResponse {
  const recommendations: ProductRecommendation[] = request.alternatives.map(product => ({
    ...product,
    comparison: generateFallbackComparison(product),
    ecoCreds: calculateEcoCredits(product),
    carbonSavings: Math.max(0, request.originalProduct.carbonIntensity - product.carbonIntensity),
    reasonForRecommendation: product.isOrganic ? 'Organic and sustainable' : 'Lower carbon footprint'
  }))

  return {
    recommendations,
    reasoning: 'These alternatives have been selected based on their superior sustainability metrics, including lower carbon footprints and organic certifications.'
  }
}

/**
 * Generate fallback comparison text
 */
function generateFallbackComparison(product: Product): string {
  const benefits = []
  
  if (product.isOrganic) {
    benefits.push('certified organic production')
  }
  
  if (product.sustainabilityScore > 70) {
    benefits.push('excellent sustainability rating')
  }
  
  if (product.carbonIntensity < 2) {
    benefits.push('low carbon footprint')
  }

  const benefitText = benefits.length > 0 ? benefits.join(', ') : 'sustainable practices'

  return `${product.name} offers a more sustainable choice with ${benefitText}. This product helps reduce your environmental impact while maintaining quality and value. By choosing this alternative, you're supporting eco-friendly practices and contributing to a more sustainable future. The improved sustainability metrics make this an excellent choice for environmentally conscious consumers.`
}

/**
 * Calculate eco credits based on sustainability score
 */
function calculateEcoCredits(product: Product): number {
  let credits = Math.floor(product.sustainabilityScore / 5) // Base credits
  
  if (product.isOrganic) credits += 15
  if (product.sustainabilityScore > 80) credits += 10
  if (product.carbonIntensity < 1) credits += 10
  
  return Math.min(50, Math.max(10, credits)) // Between 10-50 credits
}

/**
 * Create fallback recommendations when AI parsing fails
 */
function createFallbackRecommendations(alternatives: Product[]): RecommendationResponse {
  const recommendations: ProductRecommendation[] = alternatives.map(product => ({
    ...product,
    comparison: generateFallbackComparison(product),
    ecoCreds: calculateEcoCredits(product),
    carbonSavings: 0,
    reasonForRecommendation: 'Sustainable alternative'
  }))

  return {
    recommendations,
    reasoning: 'These products have been selected for their superior sustainability profiles and environmental benefits.'
  }
}
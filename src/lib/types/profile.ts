import { z } from 'zod'

// User profile interface with gamification features
export interface UserProfile {
  id: string
  email: string
  displayName: string
  firstName?: string
  lastName?: string
  photoURL?: string
  
  // Gamification metrics
  ecoCredits: number
  totalCarbonSaved: number // kg CO2e
  sustainabilityScore: number // 0-100 overall score
  level: number
  experiencePoints: number
  
  // Shopping statistics
  totalPurchases: number
  sustainableChoices: number
  organicPurchases: number
  totalSpent: number
  
  // Achievements
  achievements: Achievement[]
  badges: Badge[]
  
  // Preferences
  preferences: UserPreferences
  
  // Timestamps
  joinedAt: Date
  lastActiveAt: Date
  updatedAt: Date
}

// Achievement system
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  requirement: number
  progress: number
  completed: boolean
  completedAt?: Date
  reward: {
    ecoCredits: number
    badge?: string
  }
}

export type AchievementCategory = 
  | 'eco_warrior'
  | 'carbon_saver'
  | 'organic_lover'
  | 'smart_shopper'
  | 'community'
  | 'milestone'

// Badge system
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: BadgeRarity
  earnedAt: Date
}

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'

// User preferences
export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    recommendations: boolean
    achievements: boolean
  }
  privacy: {
    profileVisible: boolean
    statsVisible: boolean
    achievementsVisible: boolean
  }
  shopping: {
    sustainabilityFirst: boolean
    organicPreference: boolean
    budgetLimit?: number
    categories: string[]
  }
}

// Leaderboard entry
export interface LeaderboardEntry {
  userId: string
  displayName: string
  photoURL?: string
  ecoCredits: number
  carbonSaved: number
  sustainabilityScore: number
  level: number
  rank: number
  isCurrentUser?: boolean
}

// Activity feed item
export interface ActivityItem {
  id: string
  userId: string
  type: ActivityType
  title: string
  description: string
  icon: string
  ecoCredits?: number
  carbonSaved?: number
  createdAt: Date
}

export type ActivityType = 
  | 'purchase'
  | 'sustainable_swap'
  | 'achievement'
  | 'level_up'
  | 'badge_earned'
  | 'milestone'

// Statistics for dashboard
export interface ProfileStats {
  // Current period (this month)
  currentMonth: {
    ecoCredits: number
    carbonSaved: number
    purchases: number
    sustainableChoices: number
  }
  
  // Comparisons
  previousMonth: {
    ecoCredits: number
    carbonSaved: number
    purchases: number
    sustainableChoices: number
  }
  
  // All-time records
  allTime: {
    totalEcoCredits: number
    totalCarbonSaved: number
    totalPurchases: number
    totalSustainableChoices: number
    joinedDaysAgo: number
  }
  
  // Trends (last 6 months)
  trends: {
    month: string
    ecoCredits: number
    carbonSaved: number
    purchases: number
  }[]
}

// Validation schemas
export const userPreferencesSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    recommendations: z.boolean(),
    achievements: z.boolean(),
  }),
  privacy: z.object({
    profileVisible: z.boolean(),
    statsVisible: z.boolean(),
    achievementsVisible: z.boolean(),
  }),
  shopping: z.object({
    sustainabilityFirst: z.boolean(),
    organicPreference: z.boolean(),
    budgetLimit: z.number().positive().optional(),
    categories: z.array(z.string()),
  }),
})

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  preferences: userPreferencesSchema.optional(),
})

// Level calculation
export function calculateLevel(experiencePoints: number): number {
  // Level formula: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(experiencePoints / 100)) + 1
}

export function getExperienceForLevel(level: number): number {
  // XP needed for level: xp = (level - 1)^2 * 100
  return Math.pow(level - 1, 2) * 100
}

export function getExperienceToNextLevel(currentXP: number): {
  currentLevel: number
  nextLevel: number
  xpForNext: number
  xpNeeded: number
  progress: number
} {
  const currentLevel = calculateLevel(currentXP)
  const nextLevel = currentLevel + 1
  const xpForNext = getExperienceForLevel(nextLevel)
  const xpForCurrent = getExperienceForLevel(currentLevel)
  const xpNeeded = xpForNext - currentXP
  const progress = ((currentXP - xpForCurrent) / (xpForNext - xpForCurrent)) * 100

  return {
    currentLevel,
    nextLevel,
    xpForNext,
    xpNeeded,
    progress: Math.max(0, Math.min(100, progress))
  }
}
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from './use-auth'
import { 
  UserProfile, 
  Achievement, 
  Badge, 
  ProfileStats, 
  ActivityItem,
  calculateLevel,
  getExperienceToNextLevel
} from '@/lib/types/profile'

interface ProfileContextType {
  profile: UserProfile | null
  stats: ProfileStats | null
  loading: boolean
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  addEcoCredits: (credits: number, reason: string) => Promise<void>
  addCarbonSavings: (carbonSaved: number) => Promise<void>
  recordPurchase: (isSustainable: boolean, isOrganic: boolean, amount: number) => Promise<void>
  checkAchievements: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      loadProfile(user.id)
    } else {
      setProfile(null)
      setStats(null)
      setLoading(false)
    }
  }, [user])

  const loadProfile = async (userId: string) => {
    try {
      setLoading(true)
      const profileDoc = await getDoc(doc(db, 'profiles', userId))
      
      if (profileDoc.exists()) {
        const data = profileDoc.data()
        const userProfile: UserProfile = {
          ...data,
          joinedAt: data.joinedAt?.toDate() || new Date(),
          lastActiveAt: data.lastActiveAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          achievements: data.achievements || [],
          badges: data.badges || [],
        } as UserProfile
        
        setProfile(userProfile)
        await generateStats(userProfile)
      } else {
        // Create new profile
        await createInitialProfile(userId)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createInitialProfile = async (userId: string) => {
    if (!user) return

    const initialProfile: Omit<UserProfile, 'id'> = {
      email: user.email,
      displayName: user.displayName || user.email,
      firstName: '',
      lastName: '',
      photoURL: user.photoURL,
      
      // Gamification metrics
      ecoCredits: 0,
      totalCarbonSaved: 0,
      sustainabilityScore: 0,
      level: 1,
      experiencePoints: 0,
      
      // Shopping statistics
      totalPurchases: 0,
      sustainableChoices: 0,
      organicPurchases: 0,
      totalSpent: 0,
      
      // Achievements and badges
      achievements: getInitialAchievements(),
      badges: [],
      
      // Preferences
      preferences: {
        notifications: {
          email: true,
          push: true,
          recommendations: true,
          achievements: true,
        },
        privacy: {
          profileVisible: true,
          statsVisible: true,
          achievementsVisible: true,
        },
        shopping: {
          sustainabilityFirst: true,
          organicPreference: false,
          categories: [],
        },
      },
      
      // Timestamps
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, 'profiles', userId), {
      ...initialProfile,
      joinedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    setProfile({ id: userId, ...initialProfile })
    await generateStats({ id: userId, ...initialProfile })
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return

    try {
      const updatedProfile = { ...profile, ...updates, updatedAt: new Date() }
      
      await updateDoc(doc(db, 'profiles', user.id), {
        ...updates,
        updatedAt: serverTimestamp(),
      })

      setProfile(updatedProfile)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const addEcoCredits = async (credits: number, reason: string) => {
    if (!user || !profile) return

    try {
      const newCredits = profile.ecoCredits + credits
      const newXP = profile.experiencePoints + credits
      const newLevel = calculateLevel(newXP)
      
      const updates = {
        ecoCredits: newCredits,
        experiencePoints: newXP,
        level: newLevel,
        updatedAt: serverTimestamp(),
      }

      await updateDoc(doc(db, 'profiles', user.id), updates)
      
      setProfile(prev => prev ? {
        ...prev,
        ecoCredits: newCredits,
        experiencePoints: newXP,
        level: newLevel,
        updatedAt: new Date(),
      } : null)

      // Check for level up
      if (newLevel > profile.level) {
        await handleLevelUp(newLevel)
      }

      // Record activity
      await recordActivity({
        type: 'purchase',
        title: 'Eco Credits Earned',
        description: reason,
        icon: '🌱',
        ecoCredits: credits,
      })

    } catch (error) {
      console.error('Error adding eco credits:', error)
    }
  }

  const addCarbonSavings = async (carbonSaved: number) => {
    if (!user || !profile) return

    try {
      const newCarbonSaved = profile.totalCarbonSaved + carbonSaved
      
      await updateDoc(doc(db, 'profiles', user.id), {
        totalCarbonSaved: newCarbonSaved,
        updatedAt: serverTimestamp(),
      })

      setProfile(prev => prev ? {
        ...prev,
        totalCarbonSaved: newCarbonSaved,
        updatedAt: new Date(),
      } : null)

    } catch (error) {
      console.error('Error adding carbon savings:', error)
    }
  }

  const recordPurchase = async (isSustainable: boolean, isOrganic: boolean, amount: number) => {
    if (!user || !profile) return

    try {
      const updates = {
        totalPurchases: profile.totalPurchases + 1,
        totalSpent: profile.totalSpent + amount,
        updatedAt: serverTimestamp(),
      } as any

      if (isSustainable) {
        updates.sustainableChoices = profile.sustainableChoices + 1
      }

      if (isOrganic) {
        updates.organicPurchases = profile.organicPurchases + 1
      }

      await updateDoc(doc(db, 'profiles', user.id), updates)
      
      setProfile(prev => prev ? {
        ...prev,
        totalPurchases: prev.totalPurchases + 1,
        sustainableChoices: isSustainable ? prev.sustainableChoices + 1 : prev.sustainableChoices,
        organicPurchases: isOrganic ? prev.organicPurchases + 1 : prev.organicPurchases,
        totalSpent: prev.totalSpent + amount,
        updatedAt: new Date(),
      } : null)

      // Check achievements after purchase
      await checkAchievements()

    } catch (error) {
      console.error('Error recording purchase:', error)
    }
  }

  const checkAchievements = async () => {
    if (!profile) return

    // Check each achievement
    const updatedAchievements = [...profile.achievements]
    let hasNewAchievements = false

    for (let i = 0; i < updatedAchievements.length; i++) {
      const achievement = updatedAchievements[i]
      if (achievement.completed) continue

      let progress = 0
      
      // Calculate progress based on achievement type
      switch (achievement.id) {
        case 'first_purchase':
          progress = profile.totalPurchases >= 1 ? 1 : 0
          break
        case 'eco_warrior_10':
          progress = profile.sustainableChoices
          break
        case 'carbon_saver_100':
          progress = profile.totalCarbonSaved
          break
        case 'organic_lover_5':
          progress = profile.organicPurchases
          break
        case 'big_spender_1000':
          progress = profile.totalSpent
          break
      }

      // Update progress
      updatedAchievements[i] = { ...achievement, progress }

      // Check if completed
      if (progress >= achievement.requirement && !achievement.completed) {
        updatedAchievements[i] = {
          ...achievement,
          progress: achievement.requirement,
          completed: true,
          completedAt: new Date(),
        }
        hasNewAchievements = true

        // Award eco credits
        await addEcoCredits(achievement.reward.ecoCredits, `Achievement: ${achievement.name}`)
        
        // Record activity
        await recordActivity({
          type: 'achievement',
          title: 'Achievement Unlocked!',
          description: achievement.name,
          icon: achievement.icon,
          ecoCredits: achievement.reward.ecoCredits,
        })
      }
    }

    if (hasNewAchievements) {
      await updateProfile({ achievements: updatedAchievements })
    }
  }

  const handleLevelUp = async (newLevel: number) => {
    // Award bonus eco credits for leveling up
    const bonusCredits = newLevel * 10
    
    await recordActivity({
      type: 'level_up',
      title: `Level Up! Level ${newLevel}`,
      description: `Congratulations! You've reached level ${newLevel}`,
      icon: '🎉',
      ecoCredits: bonusCredits,
    })
  }

  const recordActivity = async (activity: Omit<ActivityItem, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return

    try {
      const activityItem: ActivityItem = {
        id: `activity-${Date.now()}`,
        userId: user.id,
        createdAt: new Date(),
        ...activity,
      }

      // In a real app, you'd save this to Firestore
      // For now, we'll just log it
      console.log('Activity recorded:', activityItem)
    } catch (error) {
      console.error('Error recording activity:', error)
    }
  }

  const generateStats = async (userProfile: UserProfile) => {
    // In a real app, you'd calculate these from actual data
    // For now, we'll generate mock stats based on profile data
    const mockStats: ProfileStats = {
      currentMonth: {
        ecoCredits: Math.floor(userProfile.ecoCredits * 0.3),
        carbonSaved: Math.floor(userProfile.totalCarbonSaved * 0.2),
        purchases: Math.floor(userProfile.totalPurchases * 0.4),
        sustainableChoices: Math.floor(userProfile.sustainableChoices * 0.4),
      },
      previousMonth: {
        ecoCredits: Math.floor(userProfile.ecoCredits * 0.2),
        carbonSaved: Math.floor(userProfile.totalCarbonSaved * 0.15),
        purchases: Math.floor(userProfile.totalPurchases * 0.3),
        sustainableChoices: Math.floor(userProfile.sustainableChoices * 0.3),
      },
      allTime: {
        totalEcoCredits: userProfile.ecoCredits,
        totalCarbonSaved: userProfile.totalCarbonSaved,
        totalPurchases: userProfile.totalPurchases,
        totalSustainableChoices: userProfile.sustainableChoices,
        joinedDaysAgo: Math.floor((Date.now() - userProfile.joinedAt.getTime()) / (1000 * 60 * 60 * 24)),
      },
      trends: generateTrendData(userProfile),
    }

    setStats(mockStats)
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  const value = {
    profile,
    stats,
    loading,
    updateProfile,
    addEcoCredits,
    addCarbonSavings,
    recordPurchase,
    checkAchievements,
    refreshProfile,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

// Helper functions
function getInitialAchievements(): Achievement[] {
  return [
    {
      id: 'first_purchase',
      name: 'First Steps',
      description: 'Make your first purchase',
      icon: '🛒',
      category: 'milestone',
      requirement: 1,
      progress: 0,
      completed: false,
      reward: { ecoCredits: 50 },
    },
    {
      id: 'eco_warrior_10',
      name: 'Eco Warrior',
      description: 'Choose 10 sustainable alternatives',
      icon: '🌱',
      category: 'eco_warrior',
      requirement: 10,
      progress: 0,
      completed: false,
      reward: { ecoCredits: 100 },
    },
    {
      id: 'carbon_saver_100',
      name: 'Carbon Saver',
      description: 'Save 100kg of CO₂ emissions',
      icon: '🌍',
      category: 'carbon_saver',
      requirement: 100,
      progress: 0,
      completed: false,
      reward: { ecoCredits: 200 },
    },
    {
      id: 'organic_lover_5',
      name: 'Organic Lover',
      description: 'Purchase 5 organic products',
      icon: '🥬',
      category: 'organic_lover',
      requirement: 5,
      progress: 0,
      completed: false,
      reward: { ecoCredits: 75 },
    },
  ]
}

function generateTrendData(profile: UserProfile) {
  // Generate mock trend data for the last 6 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.map((month, index) => ({
    month,
    ecoCredits: Math.floor(profile.ecoCredits * (0.1 + index * 0.15)),
    carbonSaved: Math.floor(profile.totalCarbonSaved * (0.05 + index * 0.15)),
    purchases: Math.floor(profile.totalPurchases * (0.1 + index * 0.15)),
  }))
}
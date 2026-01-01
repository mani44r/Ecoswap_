'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'
import { User, UserProfile, SignInFormData, SignUpFormData } from '@/lib/types/auth'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (data: SignInFormData) => Promise<void>
  signUp: (data: SignUpFormData) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  resendVerification: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Convert Firebase user to our User type
  const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
    id: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    createdAt: new Date(firebaseUser.metadata.creationTime!),
    lastLoginAt: new Date(firebaseUser.metadata.lastSignInTime!),
  })

  // Load user profile from Firestore
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const profileDoc = await getDoc(doc(db, 'users', userId))
      if (profileDoc.exists()) {
        const data = profileDoc.data()
        return {
          id: userId,
          ...data,
          joinedAt: data.joinedAt?.toDate() || new Date(),
        } as UserProfile
      }
      return null
    } catch (error) {
      console.error('Error loading user profile:', error)
      return null
    }
  }

  // Create user profile in Firestore
  const createUserProfile = async (firebaseUser: FirebaseUser, additionalData: Partial<UserProfile> = {}) => {
    const userProfile: Omit<UserProfile, 'id'> = {
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || additionalData.displayName || '',
      firstName: additionalData.firstName || '',
      lastName: additionalData.lastName || '',
      photoURL: firebaseUser.photoURL || '',
      ecoCredits: 0,
      totalCarbonSaved: 0,
      sustainabilityScore: 0,
      joinedAt: new Date(),
      preferences: {
        notifications: true,
        newsletter: true,
        sustainabilityAlerts: true,
      },
      ...additionalData,
    }

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userProfile,
      joinedAt: serverTimestamp(),
    })

    return { id: firebaseUser.uid, ...userProfile }
  }

  // Sign in with email and password
  const signIn = async (data: SignInFormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code))
    }
  }

  // Sign up with email and password
  const signUp = async (data: SignUpFormData) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      // Update display name
      await updateProfile(firebaseUser, {
        displayName: `${data.firstName} ${data.lastName}`,
      })

      // Create user profile
      await createUserProfile(firebaseUser, {
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: `${data.firstName} ${data.lastName}`,
      })

      // Send email verification
      await sendEmailVerification(firebaseUser)
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code))
    }
  }

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error: any) {
      throw new Error('Failed to sign out')
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code))
    }
  }

  // Resend email verification
  const resendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser)
      } catch (error: any) {
        throw new Error('Failed to send verification email')
      }
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser = mapFirebaseUser(firebaseUser)
        setUser(mappedUser)
        
        // Load user profile
        const userProfile = await loadUserProfile(firebaseUser.uid)
        setProfile(userProfile)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    resendVerification,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists'
    case 'auth/weak-password':
      return 'Password is too weak'
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection'
    default:
      return 'An error occurred. Please try again'
  }
}
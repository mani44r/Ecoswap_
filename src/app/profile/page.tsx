'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { formatCurrency, formatCarbonFootprint } from '@/lib/utils'
import { getExperienceToNextLevel } from '@/lib/types/profile'

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, stats, loading, updateProfile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    displayName: '',
    firstName: '',
    lastName: '',
  })

  if (!user) {
    return (
      <div className="bg-gradient-eco min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Sign In Required
            </h2>
            <p className="text-secondary-600 mb-6">
              Please sign in to view your profile and eco credits.
            </p>
            <Button onClick={() => window.location.href = '/auth/signin'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading || !profile) {
    return (
      <div className="bg-gradient-eco min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const levelInfo = getExperienceToNextLevel(profile.experiencePoints)

  const handleEditProfile = () => {
    setEditForm({
      displayName: profile.displayName,
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
    })
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div className="bg-gradient-eco min-h-screen">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">
            Your Eco Profile
          </h1>
          <p className="text-lg text-secondary-600">
            Track your sustainability journey and eco impact
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <Card variant="eco">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={isEditing ? handleSaveProfile : handleEditProfile}
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">
                      {profile.photoURL ? (
                        <img 
                          src={profile.photoURL} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        profile.displayName?.charAt(0) || '👤'
                      )}
                    </span>
                  </div>
                </div>

                {/* Editable Fields */}
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      label="Display Name"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                    />
                    <Input
                      label="First Name"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                    <Input
                      label="Last Name"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {profile.displayName}
                    </h3>
                    <p className="text-secondary-600">{profile.email}</p>
                    <p className="text-sm text-secondary-500">
                      Member since {profile.joinedAt.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card variant="eco">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🏆</span>
                  <span>Level {levelInfo.currentLevel}</span>
                </CardTitle>
                <CardDescription>
                  {levelInfo.xpNeeded} XP to level {levelInfo.nextLevel}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(levelInfo.progress)}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-3">
                    <div 
                      className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${levelInfo.progress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {profile.experiencePoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-secondary-600">Total XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="eco">
                <CardContent className="text-center py-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {profile.ecoCredits.toLocaleString()}
                  </div>
                  <div className="text-sm text-secondary-600">Eco Credits</div>
                  {stats && (
                    <div className="text-xs text-green-600 mt-1">
                      +{stats.currentMonth.ecoCredits} this month
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card variant="eco">
                <CardContent className="text-center py-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCarbonFootprint(profile.totalCarbonSaved)}
                  </div>
                  <div className="text-sm text-secondary-600">Carbon Saved</div>
                  {stats && (
                    <div className="text-xs text-green-600 mt-1">
                      +{formatCarbonFootprint(stats.currentMonth.carbonSaved)} this month
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card variant="eco">
                <CardContent className="text-center py-6">
                  <div className="text-3xl font-bold text-accent-600 mb-2">
                    {profile.sustainableChoices}
                  </div>
                  <div className="text-sm text-secondary-600">Sustainable Choices</div>
                  <div className="text-xs text-secondary-500 mt-1">
                    {profile.totalPurchases > 0 
                      ? Math.round((profile.sustainableChoices / profile.totalPurchases) * 100)
                      : 0
                    }% of purchases
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shopping Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Shopping Statistics</CardTitle>
                <CardDescription>Your purchasing patterns and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-900">
                      {profile.totalPurchases}
                    </div>
                    <div className="text-sm text-secondary-600">Total Purchases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {profile.organicPurchases}
                    </div>
                    <div className="text-sm text-secondary-600">Organic Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatCurrency(profile.totalSpent)}
                    </div>
                    <div className="text-sm text-secondary-600">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600">
                      {profile.sustainabilityScore}/100
                    </div>
                    <div className="text-sm text-secondary-600">Sustainability Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🏅</span>
                  <span>Achievements</span>
                </CardTitle>
                <CardDescription>Your sustainability milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.completed 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-secondary-200 bg-secondary-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            achievement.completed ? 'text-green-800' : 'text-secondary-900'
                          }`}>
                            {achievement.name}
                          </h4>
                          <p className={`text-sm ${
                            achievement.completed ? 'text-green-600' : 'text-secondary-600'
                          }`}>
                            {achievement.description}
                          </p>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>
                                {Math.min(achievement.progress, achievement.requirement)}/{achievement.requirement}
                              </span>
                            </div>
                            <div className="w-full bg-secondary-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  achievement.completed ? 'bg-green-500' : 'bg-primary-500'
                                }`}
                                style={{ 
                                  width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                          {achievement.completed && achievement.completedAt && (
                            <div className="text-xs text-green-600 mt-2">
                              Completed {achievement.completedAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary-600">
                            +{achievement.reward.ecoCredits}
                          </div>
                          <div className="text-xs text-secondary-500">credits</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
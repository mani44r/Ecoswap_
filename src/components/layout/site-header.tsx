'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold">
            🌱
          </div>
          <span className="text-xl font-bold text-secondary-900">EcoSwap</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/products" 
            className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
          >
            Products
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
          >
            About
          </Link>
          <Link 
            href="/sustainability" 
            className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
          >
            Sustainability
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-secondary-600">
                Welcome, {user.displayName || user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
              <Link href="/dashboard">
                <Button size="sm">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-secondary-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white">
          <div className="container py-4 space-y-4">
            <Link 
              href="/products" 
              className="block text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/about" 
              className="block text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/sustainability" 
              className="block text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sustainability
            </Link>
            <div className="pt-4 border-t border-secondary-200 space-y-2">
              {user ? (
                <>
                  <p className="text-sm text-secondary-600 px-2">
                    Welcome, {user.displayName || user.email}
                  </p>
                  <Link href="/dashboard">
                    <Button size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
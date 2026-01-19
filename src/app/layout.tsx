import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SiteHeader } from '@/components/layout/site-header'
import { AuthProvider } from '@/hooks/use-auth'
import { CartProvider } from '@/hooks/use-cart'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoSwap - Sustainable Shopping Platform',
  description: 'AI-powered e-commerce platform for environmentally conscious consumers. Find sustainable alternatives and reduce your carbon footprint.',
  keywords: ['sustainability', 'ecommerce', 'green shopping', 'carbon footprint', 'eco-friendly'],
  authors: [{ name: 'Ramineni Manikanta' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-secondary-50 antialiased`}>
        <AuthProvider>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
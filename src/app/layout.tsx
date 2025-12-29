import type { Metadata } from 'next'
import './globals.css'

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
      <body className="min-h-screen bg-gray-50 antialiased">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
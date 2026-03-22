import './globals.css'
import { Playfair_Display, DM_Serif_Text } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

const StarField = dynamic(() => import('@/components/effects/StarField').then(m => ({ default: m.StarField })), { ssr: false })
const GrainOverlay = dynamic(() => import('@/components/effects/GrainOverlay').then(m => ({ default: m.GrainOverlay })), { ssr: false })
const CursorGlow = dynamic(() => import('@/components/effects/CursorGlow').then(m => ({ default: m.CursorGlow })), { ssr: false })

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const dmSerif = DM_Serif_Text({
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
  weight: '400',
})

interface RootLayoutProps {
  children: ReactNode
}

export const metadata = {
  title: 'Journex',
  description: 'A premium journaling experience',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSerif.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-obsidian text-cream">
        <StarField />
        <GrainOverlay />
        <CursorGlow />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}

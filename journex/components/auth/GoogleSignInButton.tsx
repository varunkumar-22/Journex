'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export function GoogleSignInButton(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <motion.button
        type="button"
        onClick={() => void handleGoogleSignIn()}
        disabled={isLoading}
        whileHover={isLoading ? undefined : { scale: 1.015, y: -1 }}
        whileTap={isLoading ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="
          w-full flex items-center justify-center gap-3
          px-6 py-4 rounded-xl
          bg-cream/[0.03] border border-cream/[0.08]
          text-cream font-mono text-sm tracking-wide
          transition-all duration-300
          hover:bg-cream/[0.06] hover:border-amber/20 hover:shadow-glow-sm
          disabled:opacity-40 disabled:cursor-not-allowed
          group
        "
      >
        {isLoading ? (
          <motion.div
            className="w-5 h-5 rounded-full border-2 border-obsidian-600 border-t-amber"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:scale-110">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span className="text-cream/80 group-hover:text-cream transition-colors">
          {isLoading ? 'Connecting...' : 'Continue with Google'}
        </span>
      </motion.button>

      {error ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 font-mono text-center bg-red-900/10 border border-red-800/20 rounded-lg px-3 py-2"
        >
          {error}
        </motion.p>
      ) : null}
    </div>
  )
}

'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { LoginForm } from '@/components/auth/LoginForm'
import { GlowingJournalIcon } from '@/components/effects/GlowingJournalIcon'

export default function LoginPage(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 168, 83, 0.06) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <GlowingJournalIcon size={64} />
        </motion.div>

        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="font-display text-display-lg text-gradient-gold tracking-tight">
            Journex
          </h1>
          <p className="font-serif text-cream-600 text-body-sm italic mt-2">
            Welcome back to your journal
          </p>
        </motion.div>

        <motion.div
          className="glass-panel-strong rounded-2xl p-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Suspense>
            <LoginForm />
          </Suspense>
        </motion.div>
      </motion.div>
    </div>
  )
}

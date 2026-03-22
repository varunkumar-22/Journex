'use client'

import { motion } from 'framer-motion'
import { SetupProfileForm } from '@/components/auth/SetupProfileForm'

export default function SetupProfilePage(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-[400px]"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-display-lg text-gradient-gold mb-3">
            Journex
          </h1>
          <p className="font-mono text-label uppercase tracking-[0.2em] text-muted">
            Complete your profile
          </p>
        </div>

        <div className="glass-panel-strong rounded-2xl p-8 shadow-editorial">
          <SetupProfileForm />
        </div>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-obsidian-800 hover:text-amber transition-colors duration-200"
          >
            Back to Sign In
          </a>
        </div>
      </motion.div>
    </div>
  )
}

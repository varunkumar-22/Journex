'use client'

import { motion } from 'framer-motion'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps): JSX.Element {
  const sizes: Record<string, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size] ?? ''} rounded-full border-2 border-obsidian-400 border-t-amber`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

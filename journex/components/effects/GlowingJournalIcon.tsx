'use client'

import { motion } from 'framer-motion'

interface GlowingJournalIconProps {
  size?: number
}

export function GlowingJournalIcon({ size = 80 }: GlowingJournalIconProps): JSX.Element {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer glow rings */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 2.5,
          height: size * 2.5,
          background: 'radial-gradient(circle, rgba(212, 168, 83, 0.06) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          background: 'radial-gradient(circle, rgba(212, 168, 83, 0.08) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1.05, 0.95, 1.05],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Main icon container */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-2xl"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, rgba(212, 168, 83, 0.12), rgba(212, 168, 83, 0.04))',
          border: '1px solid rgba(212, 168, 83, 0.15)',
          boxShadow: '0 0 40px rgba(212, 168, 83, 0.1), inset 0 1px 0 rgba(212, 168, 83, 0.1)',
        }}
        animate={{
          y: [0, -4, 0],
          rotateZ: [0, 0.5, 0, -0.5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Journal book SVG */}
        <svg
          width={size * 0.45}
          height={size * 0.45}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <motion.path
            d="M8 7h8"
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
          />
          <motion.path
            d="M8 11h6"
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
          />
          <motion.path
            d="M8 15h4"
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1.5, delay: 1.1, ease: 'easeOut' }}
          />
        </svg>

        {/* Pen nib accent */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#D4A853"
            opacity="0.6"
          >
            <circle cx="12" cy="12" r="3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}

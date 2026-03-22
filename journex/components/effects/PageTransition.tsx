'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1],
        },
      }}
      exit={{
        opacity: 0,
        y: -8,
        filter: 'blur(4px)',
        transition: {
          duration: 0.3,
          ease: 'easeInOut',
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Stagger children wrapper */
interface StaggerContainerProps {
  children: ReactNode
  className?: string
}

export function StaggerContainer({ children, className = '' }: StaggerContainerProps): JSX.Element {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: { transition: { staggerChildren: 0.08 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className = '' }: StaggerItemProps): JSX.Element {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 10 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Spring hover scale */
interface SpringHoverProps {
  children: ReactNode
  className?: string
  scale?: number
}

export function SpringHover({ children, className = '', scale = 1.02 }: SpringHoverProps): JSX.Element {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

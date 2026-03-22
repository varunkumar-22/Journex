'use client'

import { motion } from 'framer-motion'
import type { ReactNode, MouseEventHandler } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  'aria-label'?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
}: ButtonProps): JSX.Element {
  const variants: Record<string, string> = {
    primary: 'bg-amber text-obsidian font-semibold hover:bg-amber-400 hover:shadow-glow-md',
    secondary: 'bg-transparent text-cream border border-obsidian-400 hover:border-amber/30 hover:text-amber hover:shadow-glow-sm',
    danger: 'bg-red-900/20 text-red-400 border border-red-800/20 hover:bg-red-900/40 hover:border-red-700/30',
    ghost: 'bg-transparent text-muted hover:text-cream hover:bg-obsidian-200/50',
  }

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-7 py-3.5 text-sm',
  }

  const isDisabled = disabled ?? isLoading

  return (
    <motion.button
      whileHover={isDisabled ? undefined : { scale: 1.01 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`
        relative inline-flex items-center justify-center gap-2
        rounded-xl font-mono uppercase tracking-[0.1em]
        transition-all duration-300
        focus:outline-none focus:ring-1 focus:ring-amber/30
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variants[variant] ?? ''}
        ${sizes[size] ?? ''}
        ${className}
      `}
      disabled={isDisabled}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {isLoading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </motion.span>
      ) : null}
      {children}
    </motion.button>
  )
}

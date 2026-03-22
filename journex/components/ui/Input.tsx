'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = '', id, ...rest }, ref): JSX.Element {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="space-y-2"
      >
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-label font-mono uppercase tracking-[0.1em] text-muted"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`
            input-luxury
            ${error ? 'border-red-500/50 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...rest}
        />
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 font-mono"
          >
            {error}
          </motion.p>
        ) : null}
      </motion.div>
    )
  }
)

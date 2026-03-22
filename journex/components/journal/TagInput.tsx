'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { KeyboardEvent } from 'react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
}

export function TagInput({ tags, onChange, maxTags = 10 }: TagInputProps): JSX.Element {
  const [input, setInput] = useState<string>('')

  const addTag = (value: string): void => {
    const trimmed = value.trim().toLowerCase()
    if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) return
    onChange([...tags, trimmed])
    setInput('')
  }

  const removeTag = (index: number): void => {
    onChange(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 min-h-[32px]">
      <AnimatePresence>
        {tags.map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="tag-chip"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-amber/40 hover:text-red-400 transition-colors duration-200 ml-0.5"
              aria-label={`Remove tag ${tag}`}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M2 2l4 4M6 2L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      {tags.length < maxTags ? (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(input)}
          placeholder={tags.length === 0 ? 'Add tags...' : ''}
          className="flex-1 min-w-[80px] bg-transparent text-xs font-mono text-cream-500 placeholder-obsidian-700 outline-none"
        />
      ) : null}
    </div>
  )
}

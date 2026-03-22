'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { EntryRow } from '@/types/database.types'

interface EntryListProps {
  entries: EntryRow[]
  activeEntryId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function EntryList({
  entries,
  activeEntryId,
  onSelect,
  onDelete,
}: EntryListProps): JSX.Element {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-obsidian-800">
          No entries yet
        </p>
        <p className="font-serif text-sm text-obsidian-700 mt-2 italic">
          Begin your first thought
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <AnimatePresence>
        {entries.map((entry, index) => {
          const isActive = entry.id === activeEntryId
          const date = new Date(entry.created_at)
          const dateStr = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })

          return (
            <motion.button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry.id)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12, transition: { duration: 0.2 } }}
              transition={{
                duration: 0.3,
                delay: index * 0.03,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className={`entry-card group ${isActive ? 'entry-card-active' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 text-left">
                  <p className={`text-sm font-serif truncate ${
                    isActive ? 'text-amber' : 'text-cream-300'
                  }`}>
                    {entry.title || 'Untitled'}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-obsidian-800 mt-1">
                    {dateStr} &middot; {entry.word_count} words
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(entry.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 text-obsidian-700 hover:text-red-400 text-xs p-1 transition-all duration-200"
                  aria-label={`Delete ${entry.title}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 3l6 6M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {entry.tags.length > 0 ? (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {entry.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono uppercase tracking-wider text-amber/60 bg-amber/5 px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

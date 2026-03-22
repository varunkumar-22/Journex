'use client'

import { motion } from 'framer-motion'
import type { EntryRow } from '@/types/database.types'

interface JournalCardProps {
  entry: EntryRow
  index: number
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  isStarred?: boolean
  onToggleStar?: (id: string) => void
}

export function JournalCard({ entry, index, onSelect, onDelete, isStarred = false, onToggleStar }: JournalCardProps): JSX.Element {
  const date = new Date(entry.created_at)
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const preview = entry.content_text
    ? entry.content_text.slice(0, 120) + (entry.content_text.length > 120 ? '...' : '')
    : 'No content yet'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      onClick={() => onSelect(entry.id)}
      className="journal-card group relative"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display text-lg text-cream group-hover:text-amber transition-colors duration-300 truncate">
          {entry.title || 'Untitled'}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {onToggleStar ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleStar(entry.id)
              }}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isStarred
                  ? 'text-amber'
                  : 'text-obsidian-700 opacity-0 group-hover:opacity-100 hover:text-amber'
              }`}
              aria-label={isStarred ? 'Unstar entry' : 'Star entry'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
          {entry.is_complete ? (
            <span className="text-[9px] font-mono uppercase tracking-wider text-amber bg-amber/10 px-2 py-0.5 rounded-full">
              Done
            </span>
          ) : null}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(entry.id)
            }}
            className="opacity-0 group-hover:opacity-100 text-obsidian-700 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-900/10 transition-all duration-200"
            aria-label={`Delete ${entry.title}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <p className="font-serif text-sm text-obsidian-800 leading-relaxed mb-3 line-clamp-2">
        {preview}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-obsidian-700">
          <span>{dateStr}</span>
          <span className="text-obsidian-500">&middot;</span>
          <span>{timeStr}</span>
          <span className="text-obsidian-500">&middot;</span>
          <span>{entry.word_count} words</span>
        </div>

        {entry.tags.length > 0 ? (
          <div className="flex gap-1.5">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono uppercase tracking-wider text-amber/70 bg-amber/[0.08] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

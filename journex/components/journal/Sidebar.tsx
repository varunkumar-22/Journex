'use client'

import { motion } from 'framer-motion'
import { EntryList } from './EntryList'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import type { EntryRow } from '@/types/database.types'

interface SidebarProps {
  entries: EntryRow[]
  activeEntryId: string | null
  isLoading: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onCreate: () => void
  onLogout: () => void
  username: string | null
  onBack?: () => void
}

export function Sidebar({
  entries,
  activeEntryId,
  isLoading,
  onSelect,
  onDelete,
  onCreate,
  onLogout: _onLogout,
  username,
  onBack,
}: SidebarProps): JSX.Element {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-72 h-screen flex flex-col glass-panel-strong border-r border-obsidian-400/20"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg text-gradient-gold tracking-tight">
              Journex
            </h1>
            {username ? (
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-obsidian-700 mt-0.5">
                @{username}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="gold-divider mx-5" />

      {/* New Entry */}
      <div className="px-4 py-3">
        <Button onClick={onCreate} variant="secondary" className="w-full" size="sm">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mr-1.5">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New Entry
        </Button>
      </div>

      {/* Entry List */}
      <div className="flex-1 overflow-y-auto px-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="sm" />
          </div>
        ) : (
          <EntryList
            entries={entries}
            activeEntryId={activeEntryId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        )}
      </div>

      {onBack ? (
        <>
          <div className="gold-divider mx-5" />
          <div className="px-4 py-3">
            <button
              type="button"
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 text-obsidian-700 hover:text-amber py-2 rounded-lg hover:bg-obsidian-300/30 transition-all duration-200"
              aria-label="Back to home"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12l9-9 9 9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-mono uppercase tracking-wider">Home</span>
            </button>
          </div>
        </>
      ) : null}
    </motion.aside>
  )
}

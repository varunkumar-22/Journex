'use client'

import { useCallback, useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Sidebar } from '@/components/journal/Sidebar'
import { JournalCard } from '@/components/journal/JournalCard'
import { Button } from '@/components/ui/Button'
import { useJournal } from '@/hooks/useJournal'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useStarred } from '@/hooks/useStarred'
import { useTheme } from '@/hooks/useTheme'
import type { UpdateEntryBody } from '@/types/api'

const EntryEditor = dynamic(
  () => import('@/components/journal/EntryEditor').then(m => ({ default: m.EntryEditor })),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-2 border-obsidian-500 border-t-amber animate-spin" />
    </div>
  )}
)

const WelcomeBanner = dynamic(
  () => import('@/components/journal/WelcomeBanner').then(m => ({ default: m.WelcomeBanner })),
  { ssr: false }
)

type View = 'home' | 'editor'

export default function JournalPage(): JSX.Element {
  const journal = useJournal()
  const autoSave = useAutoSave(journal.activeEntryId)
  const stars = useStarred()
  const { theme, cycleTheme } = useTheme()
  const [view, setView] = useState<View>('home')
  const [showStarredOnly, setShowStarredOnly] = useState<boolean>(false)
  const [showBanner, setShowBanner] = useState<boolean>(false)
  const [username, setUsername] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    journal.entries.forEach((e) => e.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [journal.entries])

  const filteredEntries = useMemo(() => {
    let result = journal.entries
    if (showStarredOnly) {
      result = result.filter((e) => stars.isStarred(e.id))
    }
    if (activeTag) {
      result = result.filter((e) => e.tags.includes(activeTag))
    }
    return result
  }, [journal.entries, activeTag, showStarredOnly, stars])

  // Fetch username and decide whether to show the banner
  useEffect(() => {
    const fetchUsername = async (): Promise<void> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()
        const name = profile ? (profile as { username: string }).username : 'user'
        setUsername(name)

        // Always show banner for guest users, otherwise check sessionStorage
        if (name === 'guest') {
          const guestDismissed = sessionStorage.getItem('journex-guest-banner-seen')
          if (!guestDismissed) setShowBanner(true)
        } else {
          const dismissed = sessionStorage.getItem('journex-banner-seen')
          if (!dismissed) setShowBanner(true)
        }
      } else {
        setUsername('demo')
        const dismissed = sessionStorage.getItem('journex-banner-seen')
        if (!dismissed) setShowBanner(true)
      }
    }
    void fetchUsername()
  }, [])

  const handleDismissBanner = useCallback(() => {
    setShowBanner(false)
    if (username === 'guest') {
      sessionStorage.setItem('journex-guest-banner-seen', 'true')
    } else {
      sessionStorage.setItem('journex-banner-seen', 'true')
    }
  }, [username])

  const handleLogout = useCallback(async (): Promise<void> => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }, [])

  const handleCreate = useCallback(async (): Promise<void> => {
    await journal.createEntry()
    setView('editor')
  }, [journal])

  const handleSelect = useCallback((id: string) => {
    journal.selectEntry(id)
    setView('editor')
  }, [journal])

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    await journal.deleteEntry(id)
    if (journal.activeEntryId === id) {
      setView('home')
    }
  }, [journal])

  const handleBack = useCallback(() => {
    journal.selectEntry('')
    setView('home')
  }, [journal])

  const handleSave = useCallback((patch: UpdateEntryBody) => {
    autoSave.scheduleSave(patch)
  }, [autoSave])

  return (
    <>
      <AnimatePresence>
        {showBanner ? <WelcomeBanner onDismiss={handleDismissBanner} isGuest={username === 'guest'} /> : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen"
          >
            {/* Top bar */}
            <header className="sticky top-0 z-20 bg-obsidian/60 backdrop-blur-lg border-b border-obsidian-300/30">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div>
                  <h1 className="font-display text-xl text-gradient-gold">Journex</h1>
                  {username ? (
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-obsidian-700 mt-0.5">
                      @{username}
                    </p>
                  ) : (
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-obsidian-700 mt-0.5">
                      Your Journal
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button onClick={() => void handleCreate()} size="sm" className="sm:hidden">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </Button>
                  <Button onClick={() => void handleCreate()} size="md" className="hidden sm:inline-flex">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mr-1">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    New Entry
                  </Button>
                  <button
                    type="button"
                    onClick={cycleTheme}
                    className="p-2 rounded-lg text-obsidian-700 hover:text-amber hover:bg-obsidian-300/30 transition-all duration-200"
                    aria-label={`Switch theme (current: ${theme})`}
                    title={`Theme: ${theme}`}
                  >
                    {theme === 'dark' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : theme === 'light' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleLogout()}
                    className="text-obsidian-700"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                </div>
              </div>
            </header>

            {/* Journal entries */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {journal.isLoading ? (
                <div className="flex justify-center py-24">
                  <motion.div
                    className="w-8 h-8 rounded-full border-2 border-obsidian-500 border-t-amber"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              ) : journal.entries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center justify-center py-24"
                >
                  <div className="w-20 h-20 rounded-2xl bg-obsidian-200/50 border border-obsidian-400/30 flex items-center justify-center mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber/40">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="font-display text-display-sm text-cream/40 mb-2">
                    No entries yet
                  </h2>
                  <p className="font-serif text-sm text-obsidian-700 mb-6 italic">
                    Start writing your first journal entry
                  </p>
                  <Button onClick={() => void handleCreate()} size="lg">
                    Create Your First Entry
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-obsidian-700">
                      {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => { setShowStarredOnly(!showStarredOnly); setActiveTag(null) }}
                      className={`flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-200 ${
                        showStarredOnly
                          ? 'bg-amber/15 text-amber border-amber/30'
                          : 'text-obsidian-700 border-obsidian-300/50 hover:border-amber/20 hover:text-cream'
                      }`}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill={showStarredOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Starred
                    </button>
                    {allTags.length > 0 ? (
                      <>
                        <span className="text-obsidian-400 text-[10px]">|</span>
                        <button
                          type="button"
                          onClick={() => { setActiveTag(null); setShowStarredOnly(false) }}
                          className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-200 ${
                            !activeTag && !showStarredOnly
                              ? 'bg-amber/15 text-amber border-amber/30'
                              : 'text-obsidian-700 border-obsidian-300/50 hover:border-amber/20 hover:text-cream'
                          }`}
                        >
                          All
                        </button>
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => { setActiveTag(activeTag === tag ? null : tag); setShowStarredOnly(false) }}
                            className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-200 ${
                              activeTag === tag
                                ? 'bg-amber/15 text-amber border-amber/30'
                                : 'text-obsidian-700 border-obsidian-300/50 hover:border-amber/20 hover:text-cream'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </>
                    ) : null}
                  </div>

                  <AnimatePresence>
                    {filteredEntries.map((entry, i) => (
                      <JournalCard
                        key={entry.id}
                        entry={entry}
                        index={i}
                        onSelect={handleSelect}
                        onDelete={(id) => void handleDelete(id)}
                        isStarred={stars.isStarred(entry.id)}
                        onToggleStar={stars.toggleStar}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {journal.error ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-red-400 mt-4"
                >
                  {journal.error}
                </motion.p>
              ) : null}
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex h-screen bg-obsidian"
          >
            {/* Sidebar hidden on mobile */}
            <div className="hidden md:block">
              <Sidebar
                entries={journal.entries}
                activeEntryId={journal.activeEntryId}
                isLoading={false}
                onSelect={handleSelect}
                onDelete={(id) => void handleDelete(id)}
                onCreate={() => void handleCreate()}
                onLogout={() => void handleLogout()}
                username={username}
                onBack={handleBack}
              />
            </div>

            <main className="flex-1 h-screen overflow-hidden bg-obsidian-50">
              {journal.activeEntry ? (
                <EntryEditor
                  entry={journal.activeEntry}
                  autoSave={autoSave}
                  onScheduleSave={handleSave}
                  onMarkComplete={journal.markComplete}
                  onBack={handleBack}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted text-lg">Select an entry or create a new one</p>
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

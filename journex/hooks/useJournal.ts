'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { api } from '@/lib/fetcher'
import type { EntryRow } from '@/types/database.types'
import type { UpdateEntryBody } from '@/types/api'
import type { UseJournalReturn } from '@/types/hooks'

export function useJournal(): UseJournalReturn {
  const [entries, setEntries] = useState<EntryRow[]>([])
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const activeEntry = useMemo<EntryRow | null>(
    () => entries.find((e) => e.id === activeEntryId) ?? null,
    [entries, activeEntryId]
  )

  const incompleteEntries = useMemo<EntryRow[]>(
    () => entries.filter((e) => !e.is_complete),
    [entries]
  )

  const fetchEntries = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.get<EntryRow[]>('/api/entries')
      setEntries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createEntry = useCallback(async (): Promise<void> => {
    try {
      const entry = await api.post<{ title: string }, EntryRow>('/api/entries', {
        title: 'Untitled',
      })
      setEntries((prev) => [entry, ...prev])
      setActiveEntryId(entry.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create entry')
    }
  }, [])

  const selectEntry = useCallback((id: string): void => {
    setActiveEntryId(id)
  }, [])

  const updateEntry = useCallback(
    async (id: string, patch: UpdateEntryBody): Promise<void> => {
      try {
        const updated = await api.patch<UpdateEntryBody, EntryRow>(
          `/api/entries/${id}`,
          patch
        )
        setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update entry')
      }
    },
    []
  )

  const deleteEntry = useCallback(
    async (id: string): Promise<void> => {
      try {
        await api.delete<{ id: string }>(`/api/entries/${id}`)
        setEntries((prev) => prev.filter((e) => e.id !== id))
        if (activeEntryId === id) {
          setActiveEntryId(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete entry')
      }
    },
    [activeEntryId]
  )

  const markComplete = useCallback(
    async (id: string): Promise<void> => {
      await updateEntry(id, { isComplete: true })
    },
    [updateEntry]
  )

  useEffect(() => {
    void fetchEntries()
  }, [fetchEntries])

  return {
    entries,
    activeEntry,
    activeEntryId,
    incompleteEntries,
    isLoading,
    error,
    createEntry,
    selectEntry,
    updateEntry,
    deleteEntry,
    markComplete,
  }
}

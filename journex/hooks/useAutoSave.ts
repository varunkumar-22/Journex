'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { api } from '@/lib/fetcher'
import type { EntryRow } from '@/types/database.types'
import type { UpdateEntryBody } from '@/types/api'
import type { UseAutoSaveReturn } from '@/types/hooks'

const DEFAULT_DELAY = 2000

export function useAutoSave(
  entryId: string | null,
  delay: number = DEFAULT_DELAY
): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const pendingRef = useRef<UpdateEntryBody | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback(async (): Promise<void> => {
    if (!entryId || !pendingRef.current) return

    const patch = pendingRef.current
    pendingRef.current = null

    setIsSaving(true)
    setSaveError(null)

    try {
      await api.patch<UpdateEntryBody, EntryRow>(`/api/entries/${entryId}`, patch)
      setLastSaved(new Date())
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Auto-save failed')
      pendingRef.current = patch
    } finally {
      setIsSaving(false)
    }
  }, [entryId])

  const scheduleSave = useCallback(
    (patch: UpdateEntryBody): void => {
      pendingRef.current = { ...pendingRef.current, ...patch }
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => void save(), delay)
    },
    [save, delay]
  )

  const flushSave = useCallback(async (): Promise<void> => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    await save()
  }, [save])

  // Flush on unmount so no data is lost
  useEffect(() => {
    return (): void => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (pendingRef.current && entryId) {
        void save()
      }
    }
  }, [entryId, save])

  return {
    isSaving,
    lastSaved,
    saveError,
    flushSave,
    scheduleSave,
  }
}

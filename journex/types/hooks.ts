import type { EntryRow } from './database.types'
import type { UpdateEntryBody } from './api'

export interface UseJournalReturn {
  entries: EntryRow[]
  activeEntry: EntryRow | null
  activeEntryId: string | null
  incompleteEntries: EntryRow[]
  isLoading: boolean
  error: string | null
  createEntry: () => Promise<void>
  selectEntry: (id: string) => void
  updateEntry: (id: string, patch: UpdateEntryBody) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  markComplete: (id: string) => Promise<void>
}

export interface UseAutoSaveReturn {
  isSaving: boolean
  lastSaved: Date | null
  saveError: string | null
  flushSave: () => Promise<void>
  scheduleSave: (patch: UpdateEntryBody) => void
}

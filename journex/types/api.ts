import type { EntryRow } from './database.types'

export type ApiSuccess<T> = {
  data: T
  error: null
}

export type ApiError = {
  data: null
  error: string
  code?: 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'SERVER_ERROR'
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export function isApiError<T>(res: ApiResponse<T>): res is ApiError {
  return res.error !== null
}

export interface CreateEntryBody {
  title: string
}

export interface UpdateEntryBody {
  title?: string
  content?: string
  contentText?: string
  tags?: string[]
  wordCount?: number
  isComplete?: boolean
  lastEditedSection?: string | null
}

export type EntryResponse = ApiResponse<EntryRow>
export type EntriesResponse = ApiResponse<EntryRow[]>
export type DeleteResponse = ApiResponse<{ id: string }>

export interface SetPasswordBody {
  username: string
  password: string
}

export interface SetPasswordResponse {
  success: boolean
}

'use client'

import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'journex-media'

export interface MediaItem {
  id: string
  type: 'image' | 'video' | 'drawing'
  dataUrl: string
  name: string
  createdAt: string
}

export interface UseMediaReturn {
  media: MediaItem[]
  addMedia: (item: Omit<MediaItem, 'id' | 'createdAt'>) => void
  removeMedia: (id: string) => void
}

function loadMedia(entryId: string): MediaItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${entryId}`)
    return raw ? (JSON.parse(raw) as MediaItem[]) : []
  } catch {
    return []
  }
}

function saveMedia(entryId: string, items: MediaItem[]): void {
  localStorage.setItem(`${STORAGE_KEY}-${entryId}`, JSON.stringify(items))
}

export function useMedia(entryId: string): UseMediaReturn {
  const [media, setMedia] = useState<MediaItem[]>([])

  useEffect(() => {
    setMedia(loadMedia(entryId))
  }, [entryId])

  const addMedia = useCallback(
    (item: Omit<MediaItem, 'id' | 'createdAt'>): void => {
      const newItem: MediaItem = {
        ...item,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setMedia((prev) => {
        const next = [...prev, newItem]
        saveMedia(entryId, next)
        return next
      })
    },
    [entryId]
  )

  const removeMedia = useCallback(
    (id: string): void => {
      setMedia((prev) => {
        const next = prev.filter((m) => m.id !== id)
        saveMedia(entryId, next)
        return next
      })
    },
    [entryId]
  )

  return { media, addMedia, removeMedia }
}

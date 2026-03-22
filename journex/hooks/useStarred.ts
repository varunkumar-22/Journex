'use client'

import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'journex-starred'

function loadStarred(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

export interface UseStarredReturn {
  starred: Set<string>
  isStarred: (id: string) => boolean
  toggleStar: (id: string) => void
}

export function useStarred(): UseStarredReturn {
  const [starred, setStarred] = useState<Set<string>>(new Set())

  useEffect(() => {
    setStarred(loadStarred())
  }, [])

  const isStarred = useCallback((id: string): boolean => {
    return starred.has(id)
  }, [starred])

  const toggleStar = useCallback((id: string): void => {
    setStarred((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)))
      return next
    })
  }, [])

  return { starred, isStarred, toggleStar }
}

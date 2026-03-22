'use client'

import { useState, useCallback, useEffect } from 'react'

export type Theme = 'dark' | 'light' | 'sepia'

const STORAGE_KEY = 'journex-theme'

export interface UseThemeReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved && ['dark', 'light', 'sepia'].includes(saved)) {
      setThemeState(saved)
      document.documentElement.setAttribute('data-theme', saved)
    }
  }, [])

  const setTheme = useCallback((t: Theme): void => {
    setThemeState(t)
    localStorage.setItem(STORAGE_KEY, t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const cycleTheme = useCallback((): void => {
    const order: Theme[] = ['dark', 'light', 'sepia']
    const next = order[(order.indexOf(theme) + 1) % order.length] ?? 'dark'
    setTheme(next)
  }, [theme, setTheme])

  return { theme, setTheme, cycleTheme }
}

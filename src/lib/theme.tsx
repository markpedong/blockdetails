'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'
const KEY = 'blockdetails_theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as Theme | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.classList.remove('light', 'dark')
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      root.classList.add(mql.matches ? 'dark' : 'light')
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches)
      }
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else {
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
  }, [theme])

  return { theme, setTheme: (t: Theme) => { localStorage.setItem(KEY, t); setTheme(t) } }
}

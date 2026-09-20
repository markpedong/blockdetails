'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  resolved: 'dark' | 'light'
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
  resolved: 'dark',
})

export function useTheme() {
  return useContext(ThemeContext)
}

function ThemeProviderInner({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [systemDark, setSystemDark] = useState(false)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark' || saved === 'light' || saved === 'system') setTheme(saved)
    } catch { /* Theme remains usable when storage is blocked. */ }
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const resolved = React.useMemo((): 'dark' | 'light' => {
    if (theme === 'system') {
      return systemDark ? 'dark' : 'light'
    }
    return theme
  }, [theme, systemDark])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
  }, [resolved])

  const handleSetTheme = (t: Theme) => {
    setTheme(t)
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('theme', t) } catch { /* Keep the in-memory choice. */ }
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProviderInner as ThemeProvider }
export type { Theme }

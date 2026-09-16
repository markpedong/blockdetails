'use client'

import { useTheme } from './theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  )
}

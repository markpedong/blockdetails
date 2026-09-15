'use client'

import { useTheme } from '@/lib/theme'
import Header from './components/header'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} setTheme={setTheme} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      <footer className="border-t border-border py-4 text-center text-sm text-muted">
        Data from CoinGecko. BlockDetails © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

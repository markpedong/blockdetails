'use client'

import { useTheme } from '../../lib/theme'
import Link from 'next/link'
import Nav from './layout/page'
import { SearchDialog } from './search-dialog'
import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './ui/mobile-nav'

export default function Header({ theme, setTheme }: { theme: string; setTheme: (t: 'system' | 'light' | 'dark') => void }) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-80 transition">
          BlockDetails
        </Link>

        <Nav />

        <div className="flex items-center gap-2">
          <MobileNav />
          <SearchDialog />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  )
}

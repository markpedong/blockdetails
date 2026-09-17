'use client'

import { useTheme } from '@/lib/theme'
import Link from 'next/link'
import { SearchDialog } from './search-dialog'
import { ThemeToggle } from './theme-toggle'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/cryptocurrency', label: 'Coins' },
  { href: '/cryptocurrency/tokens', label: 'Tokens' },
  { href: '/exchanges', label: 'Exchanges' },
]

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition">
          <span className="text-accent text-xl">◆</span>
          <span className="hidden sm:inline">BlockDetails</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-1.5 rounded-lg transition ${
                typeof window !== 'undefined' && new URL(window.location.href).pathname.startsWith(n.href)
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-muted hover:text-foreground hover:bg-muted/10'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <SearchDialog />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  )
}

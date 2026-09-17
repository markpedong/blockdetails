'use client'

import { useTheme } from '@/lib/theme'
import type { GlobalMarketData } from '@/lib/crypto'
import Link from 'next/link'
import { SearchDialog } from './search-dialog'
import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './ui/mobile-nav'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/cryptocurrency', label: 'Cryptocurrencies' },
  { href: '/exchanges', label: 'Exchanges' },
]

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Market bar */}
      <MarketBar />

      {/* Main header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="app-container h-12 flex items-center justify-between gap-3">
          {/* Logo + mobile menu */}
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-80 transition">
              <span className="text-accent text-lg" aria-hidden>◆</span>
              <span className="hidden sm:inline">BlockDetails</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className={`px-2.5 py-1 rounded-md transition ${
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
    </>
  )
}

/* ── Market bar (global stats strip) ── */
async function MarketBar() {
  let global: GlobalMarketData | null = null
  try {
    const res = await fetch('/api/global?currency=usd', { cache: 'no-store' })
    const json = await res.json()
    global = (json.data as GlobalMarketData) ?? null
  } catch {}

  const d = global
  if (!d) return null

  const fmt = (n: number | null | undefined) => {
    if (!n) return '—'
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
    return `$${n.toLocaleString()}`
  }

  return (
    <div className="border-b border-border bg-muted/5 text-xs">
      <div className="app-container flex items-center gap-4 py-1.5 overflow-x-auto">
        <span className="text-muted whitespace-nowrap">Cryptocurrencies: <b className="text-foreground">{d.active_cryptocurrencies?.toLocaleString() ?? '—'}</b></span>
        <span className="text-muted whitespace-nowrap">24h Vol: <b className="text-foreground">{fmt(d.total_volume_usd)}</b></span>
        <span className="text-muted whitespace-nowrap">BTC Dom: <b className="text-foreground">{d.btc_dominance?.toFixed(1) ?? '—'}%</b></span>
        <span className="text-muted whitespace-nowrap hidden sm:inline">ETH Dom: <b className="text-foreground">{d.eth_dominance?.toFixed(1) ?? '—'}%</b></span>
      </div>
    </div>
  )
}

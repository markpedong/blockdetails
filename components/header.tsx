import Link from 'next/link'
import { SearchDialog } from './search-dialog'
import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './mobile-nav'
import { CurrencySelector } from './currency-selector'
import { Logo } from './logo'
import type { GlobalMarketData } from '@/lib/crypto'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/cryptocurrency', label: 'Cryptocurrencies' },
  { href: '/exchanges', label: 'Exchanges' },
]

const SiteHeader = () => {
  return (
    <>
      <MarketBar />
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="app-container h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-80 transition">
              <Logo className="w-6 h-6" />
              <span className="hidden sm:inline">BlockDetails</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-0.5 text-sm" aria-label="Main navigation">
            {NAV.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className="px-2.5 py-1 rounded-md text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <SearchDialog />
            <CurrencySelector />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  )
}

export default SiteHeader

/* ── Market bar (global stats strip) ── */
const MarketBar = async () => {
  let global: GlobalMarketData | null = null
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/api/global?currency=usd`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(5_000) })
    const json = await res.json()
    global = (json.data as GlobalMarketData) ?? null
  } catch {}

  const d = global
  if (!d) return (
    <div className="border-b bg-muted/30">
      <div className="app-container flex items-center gap-4 py-1.5 text-xs text-muted-foreground">
        <span>Market data unavailable</span>
      </div>
    </div>
  )

  const fmt = (n: number | null | undefined) => {
    if (!n && n !== 0) return '—'
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
    return `$${n.toLocaleString()}`
  }

  const marketCap = d.total_market_cap?.usd ?? d.total_market_cap?.['usd']
  const volume = d.total_volume?.usd ?? d.total_volume?.['usd']
  const btcDominance = d.market_cap_percentage?.btc
  const ethDominance = d.market_cap_percentage?.eth
  const changePct = d.market_cap_change_percentage_24h?.usd
  const changeStr = changePct != null ? `${changePct > 0 ? '+' : ''}${changePct.toFixed(1)}%` : '—'
  const changeColor = changePct != null ? (changePct >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]') : ''

  return (
    <div className="border-b bg-muted/30 text-xs">
      <div className="app-container flex items-center gap-3 sm:gap-4 py-1.5 overflow-x-auto scrollbar-hide">
        <span className="text-muted-foreground whitespace-nowrap">Coins: <b className="text-foreground font-medium">{d.active_cryptocurrencies?.toLocaleString() ?? '—'}</b></span>
        <span className="hidden sm:inline text-border">·</span>
        <span className="text-muted-foreground whitespace-nowrap">Mkt Cap: <b className="text-foreground font-medium">{fmt(marketCap)}</b></span>
        <span className="hidden md:inline text-border">·</span>
        <span className="hidden md:inline text-muted-foreground whitespace-nowrap">24h Vol: <b className="text-foreground font-medium">{fmt(volume)}</b></span>
        <span className="hidden lg:inline text-border">·</span>
        <span className="hidden lg:inline text-muted-foreground whitespace-nowrap">BTC: <b className="text-foreground font-medium">{btcDominance?.toFixed(1) ?? '—'}%</b></span>
        <span className="hidden xl:inline text-border">·</span>
        <span className="hidden xl:inline text-muted-foreground whitespace-nowrap">ETH: <b className="text-foreground font-medium">{ethDominance?.toFixed(1) ?? '—'}%</b></span>
        <span className="hidden xl:inline text-border">·</span>
        <span className={`hidden xl:inline whitespace-nowrap font-medium ${changeColor}`}>24h: <b>{changeStr}</b></span>
      </div>
    </div>
  )
}

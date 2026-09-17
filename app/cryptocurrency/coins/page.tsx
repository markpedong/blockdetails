import { formatCompact, formatPct, pctColor, formatPrice } from '@/lib/format'
import Link from 'next/link'
import { WatchlistButton } from '@/app/components/watchlist-button'
import type { Coin, GlobalMarketData } from '@/lib/crypto'

export const metadata = { title: 'Cryptocurrency Prices by Market Cap | BlockDetails' }

const CURRENCIES = ['usd', 'eur', 'gbp', 'php', 'jpy', 'aud']

export default async function CoinsPage({
  searchParams,
}: {
  searchParams: Promise<{ currency?: string; page?: string }>
}) {
  const { currency, page } = await searchParams
  const vsCurrency = (currency || 'usd').toLowerCase()

  let coins: Coin[] = []
  try {
    const res = await fetch(`/api/coins?currency=${vsCurrency}&order=market_cap_desc&per_page=50&page=${page || 1}`, { cache: 'no-store' })
    const json = await res.json()
    coins = (json.data as Coin[]) ?? []
  } catch { /* empty on error */ }

  let global: GlobalMarketData | null = null
  try {
    const res = await fetch('/api/global?currency=' + vsCurrency)
    const json = await res.json()
    global = (json.data as GlobalMarketData) ?? null
  } catch {}

  return (
    <div className="space-y-8">
      {/* Global stats cards */}
      {global && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Market Cap" value={formatCompact(global.total_market_cap_usd ?? 0)} />
          <StatCard label="24h Volume" value={formatCompact(global.total_volume_usd ?? 0)} />
          <StatCard label="BTC Dominance" value={`${global.btc_dominance?.toFixed(1) ?? '—'}%`} />
          <StatCard label="Active Coins" value={formatNum(global.active_cryptocurrencies ?? 0)} />
        </div>
      )}

      {/* Currency selector */}
      <div className="flex gap-2 flex-wrap">
        {CURRENCIES.map(c => (
          <Link
            key={c}
            href={`/cryptocurrency${currency !== c ? `?currency=${c}` : ''}`}
            className={`px-3 py-1 text-xs rounded-full border transition ${currency === c ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
          >
            {c.toUpperCase()}
          </Link>
        ))}
      </div>

      {/* Table */}
      <CoinTable coins={coins} currency={vsCurrency} />

      {/* Pagination */}
      <Pagination currentPage={(parseInt(page || '1', 10) || 1)} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="text-muted text-xs uppercase tracking-wide">{label}</div>
      <div className="font-semibold mt-1 text-base sm:text-lg">{value}</div>
    </div>
  )
}

function formatNum(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

function CoinTable({ coins, currency }: { coins: Coin[]; currency: string }) {
  if (coins.length === 0) {
    return <div className="text-center py-12 text-muted">Failed to load coins. Please try again.</div>
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs uppercase tracking-wider border-b border-border">
            <th className="text-right py-3 px-4 font-medium w-12">#</th>
            <th className="text-left py-3 px-4 font-medium">Asset</th>
            <th className="text-right py-3 px-4 font-medium">Price</th>
            <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">1h</th>
            <th className="text-right py-3 px-4 font-medium">24h</th>
            <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">7D</th>
            <th className="text-right py-3 px-4 font-medium hidden md:table-cell">Market Cap</th>
            <th className="text-right py-3 px-4 font-medium hidden lg:table-cell">Volume (24h)</th>
            <th className="text-right py-3 px-4 font-medium text-center w-10">★</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <tr key={coin.id} className="border-b border-border/50 last:border-0 hover:bg-muted/5 transition">
              <td className="text-right py-3 px-4 text-muted">{coin.market_cap_rank}</td>
              <td className="px-4">
                <Link href={`/cryptocurrency/${coin.id}`} className="flex items-center gap-2.5">
                  {coin.image && <img src={coin.image} alt={`${coin.name} logo`} className="w-6 h-6 rounded-full" />}
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-muted text-xs hidden sm:inline">{coin.symbol.toUpperCase()}</span>
                </Link>
              </td>
              <td className="text-right py-3 px-4 font-medium">{formatPrice(coin.current_price, currency)}</td>
              <td className={`text-right py-3 px-4 hidden sm:table-cell ${pctColor(coin.price_change_percentage_1h_in_currency)}`}>
                {coin.price_change_percentage_1h_in_currency != null ? formatPct(coin.price_change_percentage_1h_in_currency) : '-'}
              </td>
              <td className={`text-right py-3 px-4 ${pctColor(coin.price_change_percentage_24h)}`}>
                {coin.price_change_percentage_24h != null ? formatPct(coin.price_change_percentage_24h) : '-'}
              </td>
              <td className={`text-right py-3 px-4 hidden sm:table-cell ${pctColor(coin.price_change_percentage_7d_in_currency)}`}>
                {coin.price_change_percentage_7d_in_currency != null ? formatPct(coin.price_change_percentage_7d_in_currency) : '-'}
              </td>
              <td className="text-right py-3 px-4 hidden md:table-cell">{formatCompact(coin.market_cap)}</td>
              <td className="text-right py-3 px-4 hidden lg:table-cell">{formatCompact(coin.total_volume)}</td>
              <td className="text-right py-3 px-4 text-center">
                <WatchlistButton coinId={coin.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Pagination({ currentPage }: { currentPage: number }) {
  if (currentPage <= 1) return null
  return (
    <div className="flex justify-center gap-2 mt-4">
      {currentPage > 1 && (
        <Link href={`/cryptocurrency?page=${currentPage - 1}`} className="px-3 py-1.5 text-xs border rounded-lg hover:bg-muted/10 transition">
          ← Prev
        </Link>
      )}
    </div>
  )
}

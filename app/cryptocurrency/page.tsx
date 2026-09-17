import { formatCompact, formatPct, pctColor, formatPrice } from '@/lib/format'
import Link from 'next/link'
import { WatchlistButton } from '@/app/components/watchlist-button'
import type { Coin, TrendingCoin, GlobalMarketData } from '@/lib/crypto'

export const metadata = { title: 'Cryptocurrency Prices by Market Cap | BlockDetails' }

const CURRENCIES = ['usd', 'eur', 'gbp', 'php', 'jpy', 'aud']

export default async function CoinsPage({
  searchParams
}: {
  searchParams: Promise<{ currency?: string; page?: string }>
}) {
  const { currency, page } = await searchParams
  const vsCurrency = (currency || 'usd').toLowerCase()

  let coins: Coin[] = []
  try {
    const res = await fetch(`/api/coins?currency=${vsCurrency}&order=market_cap_desc&per_page=50&page=${page || 1}`)
    const json = await res.json()
    coins = (json.data as Coin[]) ?? []
  } catch { /* empty on error */ }

  let global: GlobalMarketData | null = null
  try {
    const res = await fetch('/api/global?currency=' + vsCurrency)
    const json = await res.json()
    global = (json.data as GlobalMarketData) ?? null
  } catch {}

  let trending: TrendingCoin[] = []
  try {
    const res = await fetch('/api/coins/trending')
    const json = await res.json()
    trending = (json.data as TrendingCoin[]) ?? []
  } catch {}

  return (
    <div className="space-y-8">
      {/* Global stats */}
      {global && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Stat label="Market Cap" value={formatCompact(global.total_market_cap_usd ?? 0)} />
          <Stat label="24h Volume" value={formatCompact(global.total_volume_usd ?? 0)} />
          <Stat label="BTC Dominance" value={`${global.btc_dominance?.toFixed(1) ?? '—'}%`} />
          <Stat label="Active Coins" value={formatNum(global.active_cryptocurrencies ?? 0)} />
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

      {/* Trending */}
      {trending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted mb-3">🔥 Trending</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trending.slice(0, 6).map(t => (
              <Link key={t.id} href={`/cryptocurrency/${t.id}`} className="flex items-center gap-2 min-w-[160px] p-3 rounded-lg border border-border bg-card hover:border-accent/50 transition">
                <img src={t.image} alt={`${t.name} logo`} className="w-6 h-6 rounded-full" />
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted">/{t.symbol.toUpperCase()} #{t.market_cap_rank}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <CoinTable coins={coins} currency={vsCurrency} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted text-xs">{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
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
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted text-xs border-b border-border">
          <th className="text-right py-2 pr-4 font-normal">#</th>
          <th className="text-left py-2 pl-4 pr-4 font-normal">Asset</th>
          <th className="text-right py-2 pr-4 font-normal">Price</th>
          <th className="text-right py-2 px-4 font-normal hidden sm:table-cell">1h</th>
          <th className="text-right py-2 px-4 font-normal">24h</th>
          <th className="text-right py-2 px-4 font-normal hidden sm:table-cell">7D</th>
          <th className="text-right py-2 px-4 font-normal hidden md:table-cell">Market Cap</th>
          <th className="text-right py-2 px-4 font-normal hidden md:table-cell">Volume (24h)</th>
          <th className="text-right py-2 pl-4 pr-1 font-normal text-center">★</th>
        </tr>
      </thead>
      <tbody>
        {coins.map(coin => (
          <tr key={coin.id} className="border-b border-border/50 hover:bg-muted/5 transition">
            <td className="text-right py-3 pr-4 text-muted">{coin.market_cap_rank}</td>
            <td className="pl-4 pr-4">
              <Link href={`/cryptocurrency/${coin.id}`} className="flex items-center gap-2.5">
                {coin.image && <img src={coin.image} alt={`${coin.name} logo`} className="w-6 h-6 rounded-full" />}
                <span className="font-medium">{coin.name}</span>
                <span className="text-muted text-xs hidden sm:inline">{coin.symbol.toUpperCase()}</span>
              </Link>
            </td>
            <td className="text-right py-3 pr-4 font-medium">{formatPrice(coin.current_price, currency)}</td>
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
            <td className="text-right py-3 px-4 hidden md:table-cell">{formatCompact(coin.total_volume)}</td>
            <td className="text-right py-3 pl-4 pr-1 text-center">
              <WatchlistButton coinId={coin.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

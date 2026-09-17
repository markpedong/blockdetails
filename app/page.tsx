import { formatCompact, formatPct, pctColor, formatPrice } from '@/lib/format'
import Link from 'next/link'
import type { Coin, TrendingCoin, GlobalMarketData } from '@/lib/crypto'

export const metadata = { title: 'Crypto Prices Today | BlockDetails', description: 'Real-time cryptocurrency prices, market cap, and charts.' }

const CURRENCIES = ['usd', 'eur', 'gbp', 'php']

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ currency?: string }>
}) {
  const { currency } = await searchParams
  const vsCurrency = (currency || 'usd').toLowerCase()

  let coins: Coin[] = []
  try {
    const res = await fetch(`/api/coins?currency=${vsCurrency}&order=market_cap_desc&per_page=10`, { cache: 'no-store' })
    const json = await res.json()
    coins = (json.data as Coin[]) ?? []
  } catch {}

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
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Cryptocurrency Prices</h1>
          <p className="text-muted text-sm mt-0.5">Track real-time prices, market cap, and charts for {global?.active_cryptocurrencies ?? 0}+ cryptocurrencies.</p>
        </div>

        {/* Currency pills */}
        <div className="flex gap-1.5 flex-wrap">
          {CURRENCIES.map(c => (
            <Link
              key={c}
              href={`/${currency !== c ? `?currency=${c}` : ''}`}
              className={`px-2.5 py-1 text-xs rounded-md border transition ${currency === c ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
            >
              {c.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      {/* Global stats — compact inline */}
      {global && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatItem label="Market Cap" value={formatCompact(global.total_market_cap_usd ?? 0)} />
          <StatItem label="24h Volume" value={formatCompact(global.total_volume_usd ?? 0)} />
          <StatItem label="BTC Dominance" value={`${global.btc_dominance?.toFixed(1) ?? '—'}%`} />
          <StatItem label="Active Coins" value={(global.active_cryptocurrencies ?? 0).toLocaleString()} />
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Trending</h2>
          <div className="flex gap-3 overflow-x-auto pb-1.5">
            {trending.slice(0, 6).map((t: TrendingCoin) => (
              <Link key={t.id} href={`/cryptocurrency/${t.id}`} className="flex items-center gap-2.5 min-w-[160px] p-2 rounded-md border border-border bg-card hover:border-accent/40 transition shrink-0">
                {t.image && <img src={t.image} alt="" className="w-6 h-6 rounded-full" />}
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted">/{t.symbol.toUpperCase()} #{t.market_cap_rank}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top coins table */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold tracking-tight">Top Cryptocurrencies</h2>
          <Link href="/cryptocurrency" className="text-accent text-xs hover:underline font-medium">View All →</Link>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="crypto-table min-w-[640px]">
            <thead>
              <tr>
                <th className="text-right w-12">#</th>
                <th className="text-left">Asset</th>
                <th className="text-right num">Price</th>
                <th className="text-right num hidden sm:table-cell">1h</th>
                <th className="text-right num">24h</th>
                <th className="text-right num hidden sm:table-cell">7D</th>
                <th className="text-right num hidden md:table-cell">Market Cap</th>
                <th className="text-right num hidden lg:table-cell">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {(coins as Coin[]).map((coin: Coin) => (
                <tr key={coin.id}>
                  <td className="text-right text-muted">{coin.market_cap_rank}</td>
                  <td>
                    <Link href={`/cryptocurrency/${coin.id}`} className="flex items-center gap-2">
                      {coin.image && <img src={coin.image} alt="" className="w-5 h-5 rounded-full" />}
                      <span className="font-medium">{coin.name}</span>
                      <span className="text-muted text-xs hidden sm:inline">{coin.symbol.toUpperCase()}</span>
                    </Link>
                  </td>
                  <td className="text-right num font-medium">{formatPrice(coin.current_price, currency)}</td>
                  <td className={`text-right num hidden sm:table-cell ${pctColor(coin.price_change_percentage_1h_in_currency)}`}>
                    {coin.price_change_percentage_1h_in_currency != null ? formatPct(coin.price_change_percentage_1h_in_currency) : '-'}
                  </td>
                  <td className={`text-right num ${pctColor(coin.price_change_percentage_24h)}`}>
                    {coin.price_change_percentage_24h != null ? formatPct(coin.price_change_percentage_24h) : '-'}
                  </td>
                  <td className={`text-right num hidden sm:table-cell ${pctColor(coin.price_change_percentage_7d_in_currency)}`}>
                    {coin.price_change_percentage_7d_in_currency != null ? formatPct(coin.price_change_percentage_7d_in_currency) : '-'}
                  </td>
                  <td className="text-right num hidden md:table-cell">{formatCompact(coin.market_cap)}</td>
                  <td className="text-right num hidden lg:table-cell">{formatCompact(coin.total_volume)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link href="/cryptocurrency" className="inline-block px-5 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition font-medium text-sm">
          Explore All Cryptocurrencies →
        </Link>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card p-3">
      <div className="text-muted text-[10px] uppercase tracking-wide">{label}</div>
      <div className="font-semibold mt-0.5 text-sm sm:text-base">{value}</div>
    </div>
  )
}

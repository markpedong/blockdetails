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
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center space-y-3 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cryptocurrency Prices</h1>
        <p className="text-muted max-w-xl mx-auto text-sm sm:text-base">Track real-time prices, market cap, and charts for {global?.active_cryptocurrencies ?? 0}+ cryptocurrencies.</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {CURRENCIES.map(c => (
            <Link
              key={c}
              href={`/${currency !== c ? `?currency=${c}` : ''}`}
              className={`px-3 py-1 text-xs rounded-full border transition ${currency === c ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
            >
              {c.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* Global stats cards */}
      {global && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Market Cap" value={formatCompact(global.total_market_cap_usd ?? 0)} />
          <StatCard label="24h Volume" value={formatCompact(global.total_volume_usd ?? 0)} />
          <StatCard label="BTC Dominance" value={`${global.btc_dominance?.toFixed(1) ?? '—'}%`} />
          <StatCard label="Active Coins" value={formatNum(global.active_cryptocurrencies ?? 0)} />
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">🔥 Trending</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
            {trending.slice(0, 6).map((t: TrendingCoin) => (
              <Link key={t.id} href={`/cryptocurrency/${t.id}`} className="flex items-center gap-2.5 min-w-[180px] p-3 rounded-xl border border-border bg-card hover:border-accent/50 transition snap-start">
                <img src={t.image} alt={`${t.name} logo`} className="w-8 h-8 rounded-full" />
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Top Cryptocurrencies</h2>
          <Link href="/cryptocurrency" className="text-accent text-sm hover:underline font-medium">View All →</Link>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {(coins as Coin[]).map((coin: Coin) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-4">
        <Link href="/cryptocurrency" className="inline-block px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition font-medium text-sm">
          Explore All Cryptocurrencies →
        </Link>
      </section>
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

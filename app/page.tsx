import { formatCompact, formatPct, pctColor, formatPrice } from '@/lib/format'
import Link from 'next/link'
import type { Coin, TrendingCoin, GlobalMarketData } from '@/lib/crypto'

export const metadata = { title: 'Crypto Prices Today | BlockDetails', description: 'Real-time cryptocurrency prices, market cap, and charts.' }

const CURRENCIES = ['usd', 'eur', 'gbp', 'php']

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ currency?: string }>
}) {
  const { currency } = await searchParams
  const vsCurrency = (currency || 'usd').toLowerCase()

  let coins: Coin[] = []
  try {
    const res = await fetch(`/api/coins?currency=${vsCurrency}&order=market_cap_desc&per_page=10`)
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
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-3xl font-bold">Cryptocurrency Prices</h1>
        <p className="text-muted max-w-xl mx-auto">Track real-time prices, market cap, and charts for {global?.active_cryptocurrencies ?? 0}+ cryptocurrencies.</p>
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

      {/* Global stats */}
      {global && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Stat label="Market Cap" value={formatCompact(global.total_market_cap_usd ?? 0)} />
          <Stat label="24h Volume" value={formatCompact(global.total_volume_usd ?? 0)} />
          <Stat label="BTC Dominance" value={`${global.btc_dominance?.toFixed(1) ?? '—'}%`} />
          <Stat label="Active Coins" value={formatNum(global.active_cryptocurrencies ?? 0)} />
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted mb-3">🔥 Trending</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trending.slice(0, 6).map((t: TrendingCoin) => (
              <Link key={t.id} href={`/cryptocurrency/${t.id}`} className="flex items-center gap-2 min-w-[160px] p-3 rounded-lg border border-border bg-card hover:border-accent/50 transition">
                <img src={t.image} alt={`${t.name} logo`} className="w-6 h-6 rounded-full" />
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted">/{t.symbol.toUpperCase()} #{t.market_cap_rank}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top coins */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Top Cryptocurrencies</h2>
          <Link href="/cryptocurrency" className="text-accent text-sm hover:underline">View All →</Link>
        </div>
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
            </tr>
          </thead>
          <tbody>
            {(coins as Coin[]).map((coin: Coin) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <Link href="/cryptocurrency" className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition">
          Explore All Cryptocurrencies →
        </Link>
      </section>
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

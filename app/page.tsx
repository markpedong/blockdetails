import { getGlobalData, getCoins } from '../lib/crypto'
import { formatCompact, formatPrice } from '../lib/format'
import Link from 'next/link'

export const metadata = {
  title: 'BlockDetails — Real-Time Cryptocurrency Data',
  description: 'Track cryptocurrency prices, market caps, charts, and exchange data powered by CoinGecko.',
  openGraph: { title: 'BlockDetails — Real-Time Cryptocurrency Data', description: 'Track cryptocurrency prices, market caps, charts, and exchange data.', type: 'website' },
}

export default async function HomePage() {
  let globalData: Awaited<ReturnType<typeof getGlobalData>> | null = null
  try { globalData = await getGlobalData() } catch {}

  let topCoins: Awaited<ReturnType<typeof getCoins>> = []
  try { topCoins = await getCoins({ vs_currency: 'usd', order: 'market_cap_desc', per_page: 10, sparkline: false }) } catch {}

  // If both calls fail, render a fallback instead of triggering not-found
  if (!globalData && topCoins.length === 0) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold">Unable to load data</h1>
        <p className="text-muted mt-2">CoinGecko API may be rate-limited. Please try again in a moment.</p>
      </div>
    )
  }

  // Render partial data if only one call succeeded
  const hasGlobal = !!globalData?.total_market_cap?.usd
  const hasCoins = topCoins.length > 0

  if (!hasGlobal && !hasCoins) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold">Unable to load data</h1>
        <p className="text-muted mt-2">CoinGecko API may be rate-limited. Please try again in a moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Real-Time Cryptocurrency Data</h1>
        <p className="text-muted max-w-xl mx-auto">Track prices, market caps, charts, and exchange data for 12,000+ cryptocurrencies. Powered by CoinGecko.</p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/cryptocurrency" className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition">Browse Coins</Link>
          <Link href="/exchanges" className="px-5 py-2 border rounded-lg hover:bg-muted/10 transition">Exchanges</Link>
        </div>
      </section>

      {/* Global stats */}
      {globalData && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-muted text-xs">Cryptocurrencies</div>
            <div className="font-semibold mt-1">{globalData.active_cryptocurrencies?.toLocaleString() ?? '-'}</div>
          </div>
          <div>
            <div className="text-muted text-xs">BTC Dominance</div>
            <div className="font-semibold mt-1">{globalData.btc_dominance?.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-muted text-xs">Total Market Cap</div>
            <div className="font-semibold mt-1">${formatCompact(globalData.total_market_cap?.usd ?? 0)}</div>
          </div>
          <div>
            <div className="text-muted text-xs">24h Volume</div>
            <div className="font-semibold mt-1">${formatCompact(globalData.total_volume?.usd ?? 0)}</div>
          </div>
        </section>
      )}

      {/* Top coins */}
      {topCoins.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Top Cryptocurrencies</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs border-b border-border">
                <th className="text-right py-2 pr-4 font-normal">#</th>
                <th className="text-left py-2 pl-4 pr-4 font-normal">Coin</th>
                <th className="text-right py-2 px-4 font-normal">Price</th>
                <th className="text-right py-2 px-4 font-normal">Market Cap</th>
                <th className="text-right py-2 pl-4 pr-1 font-normal text-center">→</th>
              </tr>
            </thead>
            <tbody>
              {topCoins.map(coin => (
                <tr key={coin.id} className="border-b border-border/50 hover:bg-muted/5 transition">
                  <td className="text-right py-3 pr-4 text-muted">{coin.market_cap_rank}</td>
                  <td className="pl-4 pr-4">
                    <Link href={`/cryptocurrency/${coin.id}`} className="flex items-center gap-2.5">
                      <img src={coin.image} alt={`${coin.name} logo`} className="w-6 h-6 rounded-full" />
                      <span className="font-medium">{coin.name}</span>
                    </Link>
                  </td>
                  <td className="text-right py-3 px-4">${formatPrice(coin.current_price ?? 0, 'usd')}</td>
                  <td className="text-right py-3 px-4">{formatCompact(coin.market_cap)}</td>
                  <td className="text-right py-3 pl-4 pr-1 text-center">
                    <Link href={`/cryptocurrency/${coin.id}`} className="text-accent hover:underline">→</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <h3 className="font-semibold mb-1">📊 Real-Time Prices</h3>
          <p className="text-muted text-sm">Live price data for 12,000+ cryptocurrencies updated every minute.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">📈 Interactive Charts</h3>
          <p className="text-muted text-sm">7-day price charts with OHLC data and volume overlays.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">⭐ Watchlists</h3>
          <p className="text-muted text-sm">Save your favorite coins and track them in one place.</p>
        </div>
      </section>
    </div>
  )
}

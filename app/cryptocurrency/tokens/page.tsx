import { getCoins, getGlobalData } from '../../../lib/crypto'
import { formatCompact, formatPct, pctColor, formatPrice } from '../../../lib/format'
import Link from 'next/link'
import { WatchlistButton } from '../../components/watchlist-button'
import type { Coin } from '../../../lib/crypto'

export const metadata = {
  title: 'Cryptocurrency Tokens | BlockDetails',
  description: 'Browse and track cryptocurrency tokens across multiple blockchains.',
  openGraph: { title: 'Cryptocurrency Tokens | BlockDetails', description: 'Real-time token market data.', type: 'website' }
}

const CURRENCIES = ['usd', 'eur', 'gbp', 'php']

export default async function TokensPage({
  searchParams
}: {
  searchParams: Promise<{ currency?: string }>
}) {
  const { currency } = await searchParams
  const vsCurrency = (currency || 'usd').toLowerCase()

  let coins: Awaited<ReturnType<typeof getCoins>> = []
  try {
    coins = await getCoins({ vs_currency: vsCurrency, order: 'market_cap_desc', per_page: 50, page: 1 })
    // Filter to tokens (coins with platform info)
    coins = coins.filter(c => c.platform_id || c.symbol.includes('.'))
  } catch {}

  return (
    <div className="space-y-6">
      {/* Currency selector */}
      <div className="flex gap-2 flex-wrap">
        {CURRENCIES.map(c => (
          <Link
            key={c}
            href={`/cryptocurrency/tokens${currency !== c ? `?currency=${c}` : ''}`}
            className={`px-3 py-1 text-xs rounded-full border transition ${currency === c ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
          >
            {c.toUpperCase()}
          </Link>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs border-b border-border">
            <th className="text-right py-2 pr-4 font-normal">#</th>
            <th className="text-left py-2 pl-4 pr-4 font-normal">Token</th>
            <th className="text-right py-2 pr-4 font-normal">Price</th>
            <th className="text-right py-2 px-4 font-normal">24h</th>
            <th className="text-right py-2 px-4 font-normal hidden md:table-cell">Market Cap</th>
            <th className="text-right py-2 pl-4 pr-1 font-normal text-center">★</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <tr key={coin.id} className="border-b border-border/50 hover:bg-muted/5 transition">
              <td className="text-right py-3 pr-4 text-muted">{coin.market_cap_rank}</td>
              <td className="pl-4 pr-4">
                <Link href={`/cryptocurrency/${coin.id}`} className="flex items-center gap-2.5">
                  <img src={coin.image} alt={`${coin.name} logo`} className="w-6 h-6 rounded-full" />
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-muted text-xs">/{coin.symbol.toUpperCase()}</span>
                </Link>
              </td>
              <td className="text-right py-3 pr-4 font-medium">{formatPrice(coin.current_price, vsCurrency)}</td>
              <td className={`text-right py-3 px-4 ${pctColor(coin.price_change_percentage_24h)}`}>
                {coin.price_change_percentage_24h != null ? formatPct(coin.price_change_percentage_24h) : '-'}
              </td>
              <td className="text-right py-3 px-4 hidden md:table-cell">{formatCompact(coin.market_cap)}</td>
              <td className="text-right py-3 pl-4 pr-1 text-center">
                <WatchlistButton coinId={coin.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {coins.length === 0 && (
        <div className="text-center py-12 text-muted">No tokens found. Try a different currency.</div>
      )}
    </div>
  )
}

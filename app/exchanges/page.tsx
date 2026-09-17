import { formatCompact, formatPct, pctColor, formatPrice } from '@/lib/format'
import Link from 'next/link'

export const metadata = { title: 'Exchanges | BlockDetails', description: 'Compare cryptocurrency exchanges by volume, trust score, and liquidity.' }

export default async function ExchangesPage() {
  let exchanges: any[] = []
  try {
    const res = await fetch('/api/exchanges?order=volume_desc&per_page=50&page=1')
    const json = await res.json()
    if (json.data) exchanges = json.data
  } catch {}

  return (
    <div className="space-y-5">
      <h1 className="text-lg sm:text-xl font-bold tracking-tight">Cryptocurrency Exchanges</h1>
      <p className="text-sm text-muted">Compare exchanges by trading volume, trust score, and liquidity.</p>

      {exchanges.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-muted text-sm">No exchanges found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="border-b border-border bg-muted/5 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-2.5 font-medium">#</th>
                <th className="px-4 py-2.5 font-medium">Exchange</th>
                <th className="px-4 py-2.5 font-medium text-right">Trust Score</th>
                <th className="px-4 py-2.5 font-medium text-right">24h Volume</th>
                <th className="px-4 py-2.5 font-medium text-right">Reported Volume</th>
                <th className="px-4 py-2.5 font-medium text-right">Coin Markets</th>
                <th className="px-4 py-2.5 font-medium text-right">Quote Markets</th>
                <th className="px-4 py-2.5 font-medium text-right">Scorer Markets</th>
                <th className="px-4 py-2.5 font-medium text-right">Market Share</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((ex, i) => (
                <tr key={ex.id} className="border-b border-border hover:bg-muted/5">
                  <td className="px-4 py-2.5 text-muted">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <Link href={`/exchanges/${ex.id}`} className="font-medium hover:text-accent transition-colors">
                      <div className="flex items-center gap-2">
                        {ex.image && <img src={ex.image} alt="" className="w-5 h-5 rounded-full" />}
                        <span>{ex.name}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {ex.trust_score && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${ex.trust_score >= 7 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {ex.trust_score}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">{formatCompact(ex.total_volume_24h_btc ?? 0)}</td>
                  <td className="px-4 py-2.5 text-right">{formatCompact(ex.total_volume_btc_24h ?? 0)}</td>
                  <td className="px-4 py-2.5 text-right">{ex.num_coin_markets ?? 0}</td>
                  <td className="px-4 py-2.5 text-right">{ex.num_quote_assets ?? 0}</td>
                  <td className="px-4 py-2.5 text-right">{ex.num_scorer_markets ?? 0}</td>
                  <td className="px-4 py-2.5 text-right">{ex.market_share != null ? `${(ex.market_share * 100).toFixed(1)}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

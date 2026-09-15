import { getExchanges } from '@/lib/exchange'
import { formatCompact } from '@/lib/format'
import Link from 'next/link'

export const metadata = {
  title: 'Cryptocurrency Exchanges | BlockDetails',
  description: 'Compare cryptocurrency exchanges by volume, trust score, and markets.',
  openGraph: { title: 'Cryptocurrency Exchanges | BlockDetails', description: 'Exchange comparison and data.', type: 'website' }
}

const CURRENCIES = ['usd', 'eur', 'gbp']

export default async function ExchangesPage({
  searchParams
}: {
  searchParams: Promise<{ currency?: string }>
}) {
  const { currency } = await searchParams
  const vsCurrency = (currency || 'usd').toLowerCase()

  let exchanges: Awaited<ReturnType<typeof getExchanges>> = []
  try {
    exchanges = await getExchanges()
  } catch {}

  return (
    <div className="space-y-6">
      {/* Currency selector */}
      <div className="flex gap-2 flex-wrap">
        {CURRENCIES.map(c => (
          <Link
            key={c}
            href={`/exchanges${currency !== c ? `?currency=${c}` : ''}`}
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
            <th className="text-left py-2 pl-4 pr-4 font-normal">Exchange</th>
            <th className="text-right py-2 px-4 font-normal">Trust Score</th>
            <th className="text-right py-2 px-4 font-normal hidden sm:table-cell">Markets</th>
            <th className="text-right py-2 px-4 font-normal">Volume (24h)</th>
            <th className="text-right py-2 pl-4 pr-1 font-normal text-center">→</th>
          </tr>
        </thead>
        <tbody>
          {exchanges.map(ex => (
            <tr key={ex.id} className="border-b border-border/50 hover:bg-muted/5 transition">
              <td className="text-right py-3 pr-4 text-muted">{ex.market_identifier}</td>
              <td className="pl-4 pr-4">
                <Link href={`/exchanges/${ex.id}`} className="flex items-center gap-2.5">
                  <img src={ex.image} alt={`${ex.name} logo`} className="w-6 h-6 rounded-full" />
                  <span className="font-medium">{ex.name}</span>
                </Link>
              </td>
              <td className="text-right py-3 px-4">
                <TrustBadge score={ex.trust_score} />
              </td>
              <td className="text-right py-3 px-4 hidden sm:table-cell">{ex.markets?.toLocaleString() ?? '-'}</td>
              <td className="text-right py-3 px-4">{formatCompact(ex.total_24h_volume?.[vsCurrency] ?? 0)}</td>
              <td className="text-right py-3 pl-4 pr-1 text-center">
                <Link href={`/exchanges/${ex.id}`} className="text-accent hover:underline">→</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {exchanges.length === 0 && (
        <div className="text-center py-12 text-muted">Failed to load exchanges. Please try again.</div>
      )}
    </div>
  )
}

function TrustBadge({ score }: { score: string | number }) {
  const num = typeof score === 'string' ? parseFloat(score) : score
  if (num == null) return <span className="text-muted">-</span>
  const cls = num >= 8 ? 'bg-emerald-500/20 text-emerald-500' : num >= 6 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{num}</span>
}

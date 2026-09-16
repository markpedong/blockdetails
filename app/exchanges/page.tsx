import { getExchanges } from '../../lib/exchange'
import { formatCompact } from '../../lib/format'
import { SUPPORTED_CURRENCIES, parseCurrencyFromUrl, persistCurrency } from '../../lib/currency'
import Link from 'next/link'
import { Pagination } from '../components/ui/pagination'

export const metadata = {
  title: 'Cryptocurrency Exchanges | BlockDetails',
  description: 'Compare cryptocurrency exchanges by volume, trust score, and markets.',
  openGraph: { title: 'Cryptocurrency Exchanges | BlockDetails', description: 'Exchange comparison and data.', type: 'website' },
}

const PER_PAGE = 50

export default async function ExchangesPage({ searchParams }: { searchParams: Promise<{ currency?: string; page?: string }> }) {
  const [currency, rawPage] = await Promise.all([parseCurrencyFromUrl(searchParams), (await searchParams).page])
  const page = Math.max(1, parseInt(rawPage || '1', 10))

  persistCurrency(currency)

  let exchanges: Awaited<ReturnType<typeof getExchanges>> = []
  try {
    // Fetch page 1 to determine total pages
    const firstPage = await getExchanges()
    exchanges = firstPage.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  } catch {}

  const baseHref = `/exchanges?currency=${currency}`
  let totalExchanges: Awaited<ReturnType<typeof getExchanges>> = []
  try { totalExchanges = await getExchanges() } catch {}
  const totalPages = Math.max(1, Math.ceil(totalExchanges.length / PER_PAGE))

  return (
    <div className="space-y-6">
      {/* Currency selector */}
      <CurrencySelector currency={currency} baseHref={baseHref} />

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
              <td className="text-right py-3 px-4">{formatCompact(ex.total_24h_volume?.[currency] ?? 0)}</td>
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

      <Pagination currentPage={page} totalPages={totalPages} baseHref={baseHref} />
    </div>
  )
}

function CurrencySelector({ currency, baseHref }: { currency: string; baseHref: string }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {SUPPORTED_CURRENCIES.map(c => (
        <Link
          key={c}
          href={`${baseHref}${currency !== c ? `&currency=${c}` : ''}`}
          className={`px-3 py-1 text-xs rounded-full border transition ${currency === c ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
        >
          {c.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}

function TrustBadge({ score }: { score: string | number }) {
  const num = typeof score === 'string' ? parseFloat(score) : score
  if (num == null) return <span className="text-muted">-</span>
  const cls = num >= 8 ? 'bg-emerald-500/20 text-emerald-500' : num >= 6 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{num}</span>
}

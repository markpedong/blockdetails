import { formatCompact, formatPrice } from '@/lib/format'
import Link from 'next/link'
import type { ExchangeSummary, PaginatedResponse } from '@/lib/crypto'

export const metadata = {
  title: 'Cryptocurrency Exchanges | BlockDetails',
  description: 'Compare cryptocurrency exchanges by volume, trust score, and markets.',
  openGraph: { title: 'Cryptocurrency Exchanges | BlockDetails', description: 'Exchange comparison and data.', type: 'website' },
}

const PER_PAGE = 50

export default async function ExchangesPage({ searchParams }: { searchParams: Promise<{ currency?: string; page?: string }> }) {
  const rawPage = (await searchParams).page
  const page = Math.max(1, parseInt(rawPage || '1', 10))

  let exchanges: ExchangeSummary[] = []
  try {
    const res = await fetch(`/api/exchanges?per_page=${PER_PAGE}&page=${page}`)
    const json = await res.json()
    exchanges = (json.data as ExchangeSummary[]) ?? []
  } catch {}

  const baseHref = `/exchanges?page=${page}`

  return (
    <div className="space-y-6">
      {/* Currency selector */}
      <CurrencySelector baseHref={baseHref} />

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wider border-b border-border">
              <th className="text-right py-3 px-4 font-medium w-12">#</th>
              <th className="text-left py-3 px-4 font-medium">Exchange</th>
              <th className="text-right py-3 px-4 font-medium">Trust Score</th>
              <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">Markets</th>
              <th className="text-right py-3 px-4 font-medium">Volume (24h)</th>
              <th className="text-right py-3 px-4 font-medium text-center w-10">→</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((ex: ExchangeSummary) => (
              <tr key={ex.id} className="border-b border-border/50 last:border-0 hover:bg-muted/5 transition">
                <td className="text-right py-3 px-4 text-muted">{ex.id}</td>
                <td className="px-4">
                  <Link href={`/exchanges/${ex.id}`} className="flex items-center gap-2.5">
                    {ex.image && <img src={ex.image} alt={`${ex.name} logo`} className="w-6 h-6 rounded-full" />}
                    <span className="font-medium">{ex.name}</span>
                  </Link>
                </td>
                <td className="text-right py-3 px-4">
                  <TrustBadge score={ex.trust_score} />
                </td>
                <td className="text-right py-3 px-4 hidden sm:table-cell">{ex.markets?.toLocaleString() ?? '-'}</td>
                <td className="text-right py-3 px-4">{formatCompact(ex.total_24h_volume_usd ?? 0)}</td>
                <td className="text-right py-3 px-4 text-center">
                  <Link href={`/exchanges/${ex.id}`} className="text-accent hover:underline">→</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exchanges.length === 0 && (
        <div className="text-center py-12 text-muted">Failed to load exchanges. Please try again.</div>
      )}

      <Pagination currentPage={page} baseHref={baseHref} />
    </div>
  )
}

function CurrencySelector({ baseHref }: { baseHref: string }) {
  const currencies = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'php'] as const
  return (
    <div className="flex gap-2 flex-wrap">
      {currencies.map(c => (
        <Link
          key={c}
          href={`${baseHref}&currency=${c}`}
          className={`px-3 py-1 text-xs rounded-full border transition ${baseHref.includes(`currency=${c}`) ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
        >
          {c.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}

function TrustBadge({ score }: { score: string | null }) {
  const num = score != null ? (typeof score === 'string' ? parseFloat(score) : score) : 0
  if (num <= 0) return <span className="text-muted">-</span>
  const cls = num >= 8 ? 'bg-emerald-500/20 text-emerald-500' : num >= 6 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{num}</span>
}

function Pagination({ currentPage, baseHref }: { currentPage: number; baseHref: string }) {
  if (currentPage <= 1) return null
  return (
    <div className="flex justify-center gap-2 mt-4">
      {currentPage > 1 && (
        <Link href={`${baseHref.replace(/page=\d+/, `page=${currentPage - 1}`)}`} className="px-3 py-1.5 text-xs border rounded-lg hover:bg-muted/10 transition">
          ← Prev
        </Link>
      )}
    </div>
  )
}

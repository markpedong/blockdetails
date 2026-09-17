import { formatCompact, formatPrice } from '@/lib/format'
import Link from 'next/link'

export async function generateStaticParams() {
  try {
    const res = await fetch('/api/exchanges?order=volume_desc&per_page=50', { next: { revalidate: 86400 } })
    const json = await res.json()
    return (json.data as { id: string }[]).slice(0, 50).map(e => ({ slug: e.id }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const res = await fetch(`/api/exchanges/${slug}`)
    const json = await res.json()
    if (json.data?.exchange) {
      const ex = json.data.exchange
      return {
        title: `${ex.name} Exchange — Volume, Trust Score & Markets | BlockDetails`,
        description: `View ${ex.name} exchange data, trust score, trading volume, and supported markets.`,
        openGraph: { title: `${ex.name} | BlockDetails`, description: `Real-time ${ex.name} exchange data.`, type: 'website' },
      }
    }
  } catch {}
  return { title: 'Exchange Details | BlockDetails' }
}

type ExchangeApiResponse = { exchange?: any; pairs?: any[] }

export default async function ExchangeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let apiRes: ExchangeApiResponse | null = null
  try {
    const res = await fetch(`/api/exchanges/${slug}`)
    const json = await res.json()
    if (json.data?.exchange) apiRes = json.data as ExchangeApiResponse
  } catch {}

  const exchange = apiRes?.exchange ?? null

  if (!exchange) {
    return (
      <div className="text-center py-24 space-y-3">
        <h1 className="text-xl font-semibold text-red-500">Exchange not found</h1>
        <p className="text-muted text-sm">This exchange may have been delisted or the ID is incorrect.</p>
      </div>
    )
  }

  const pairs = apiRes?.pairs ?? []

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3 flex-wrap">
        {exchange.image && (
          <img src={exchange.image} alt="" className="w-8 h-8 rounded-full" />
        )}
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">{exchange.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            {exchange.trust_score && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${exchange.trust_score >= 7 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                Trust Score: {exchange.trust_score}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatRow label="24h Volume (BTC)" value={formatCompact(exchange.total_volume_btc_24h ?? 0)} />
        <StatRow label="Total Volume (BTC)" value={formatCompact(exchange.total_volume_24h_btc ?? 0)} />
        <StatRow label="Coin Markets" value={(exchange.num_coin_markets ?? 0).toString()} />
        <StatRow label="Quote Assets" value={(exchange.num_quote_assets ?? 0).toString()} />
        <StatRow label="Scorer Markets" value={(exchange.num_scorer_markets ?? 0).toString()} />
        <StatRow label="Market Share" value={exchange.market_share != null ? `${(exchange.market_share * 100).toFixed(1)}%` : '—'} />
      </div>

      {/* Description */}
      {exchange.description && (
        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizeHtml(exchange.description) }} />
      )}

      {/* Links */}
      {renderLinks(exchange)}

      {/* Trading pairs */}
      {pairs.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Trading Pairs ({pairs.length})</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="border-b border-border bg-muted/5 text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-2.5 font-medium">Base</th>
                  <th className="px-4 py-2.5 font-medium">Quote</th>
                  <th className="px-4 py-2.5 font-medium text-right">Volume (BTC)</th>
                </tr>
              </thead>
              <tbody>
                {pairs.slice(0, 100).map((pair: any) => (
                  <tr key={pair.market_id} className="border-b border-border hover:bg-muted/5">
                    <td className="px-4 py-2.5 font-medium">{pair.base_symbol}</td>
                    <td className="px-4 py-2.5 text-muted">{pair.quote_symbol}</td>
                    <td className="px-4 py-2.5 text-right">{formatCompact(pair.volume_btc_24h ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function renderLinks(exchange: any) {
  const links: { label: string; href: string }[] = []
  if (exchange.url) links.push({ label: '🌐 Website', href: sanitizeUrl(exchange.url) })
  if (exchange.market_center_url) links.push({ label: '📊 Trade', href: sanitizeUrl(exchange.market_center_url) })
  if (links.length === 0) return null
  return (
    <div className="flex gap-4 flex-wrap text-sm">
      {links.map(l => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-accent">{l.label}</a>
      ))}
    </div>
  )
}

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '#'
    return url
  } catch { return '#' }
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"|on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, 'unsafe:')
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card p-3">
      <div className="text-muted text-[10px] uppercase tracking-wide">{label}</div>
      <div className="font-semibold mt-0.5 text-xs sm:text-sm">{value}</div>
    </div>
  )
}

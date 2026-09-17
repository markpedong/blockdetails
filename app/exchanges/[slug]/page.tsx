import { formatCompact, formatPrice } from '@/lib/format'
import Link from 'next/link'
import type { ExchangeDetail, ExchangeMarketPair } from '@/lib/crypto'

export async function generateStaticParams() {
  try {
    const res = await fetch('/api/exchanges?per_page=30', { next: { revalidate: 86400 } })
    const json = await res.json()
    return (json.data as { id: string }[]).slice(0, 30).map(e => ({ slug: e.id }))
  } catch { return [] }
}

// ponytail: revalidate removed — exchange markets contain last_price which must be fresh.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const res = await fetch(`/api/exchanges/${slug}`)
    const json = await res.json()
    if (json.data?.exchange) {
      const ex = json.data.exchange
      return {
        title: `${ex.name} Exchange - Cryptocurrency Trading | BlockDetails`,
        description: `View ${ex.name} exchange data, markets, and volume.`,
      }
    }
  } catch {}
  return { title: 'Exchange Details | BlockDetails' }
}

export default async function ExchangeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let exchange: ExchangeDetail | null = null
  try {
    const res = await fetch(`/api/exchanges/${slug}`)
    const json = await res.json()
    if (json.data?.exchange) exchange = json.data.exchange as ExchangeDetail
  } catch {}

  let markets: ExchangeMarketPair[] = []
  try {
    const res = await fetch(`/api/exchanges/${slug}/markets?per_page=50`, { cache: 'no-store' })
    const json = await res.json()
    markets = (json.data as ExchangeMarketPair[]) ?? []
  } catch {}

  if (!exchange) {
    return (
      <div className="text-center py-24">
        <h1 className="text-xl font-semibold text-red-500">Exchange not found</h1>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        {exchange.image && (
          <img src={exchange.image} alt={`${exchange.name} logo`} className="w-12 h-12 rounded-full" />
        )}
        <div>
          <h1 className="text-xl font-bold">{exchange.name}</h1>
          {exchange.trust_score && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${Number(exchange.trust_score) >= 8 ? 'bg-emerald-500/20 text-emerald-500' : Number(exchange.trust_score) >= 6 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
              Trust Score: {exchange.trust_score}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <Stat label="Markets" value={exchange.markets?.toLocaleString() ?? '-'} />
        <Stat label="24h Volume" value={formatCompact(exchange.total_24h_volume_usd ?? 0)} />
        <Stat label="24h Trades" value="-" />
        <Stat label="Established" value={exchange.established?.toString() ?? '-'} />
      </div>

      {/* Description */}
      {exchange.description && (
        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizeHtml(exchange.description) }} />
      )}

      {/* Links */}
      {renderLinks(exchange!)}

      {/* Markets table */}
      <h2 className="text-lg font-semibold mt-6">Markets</h2>
      {markets.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-xs border-b border-border">
              <th className="text-left py-2 pl-4 pr-4 font-normal">Pair</th>
              <th className="text-right py-2 px-4 font-normal">Price</th>
              <th className="text-right py-2 px-4 font-normal">24h Volume</th>
              <th className="text-right py-2 pl-4 pr-1 font-normal">Trust</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m: ExchangeMarketPair) => (
              <tr key={`${m.base}/${m.quote}`} className="border-b border-border/50 hover:bg-muted/5 transition">
                <td className="pl-4 pr-4 font-medium">{m.base}/{m.quote}</td>
                <td className="text-right py-2 px-4">{formatPrice(m.last_price, 'usd')}</td>
                <td className="text-right py-2 px-4">{formatCompact(m.volume_24h_usd ?? 0)}</td>
                <td className="text-right py-2 pl-4 pr-1">
                  {m.trust_score && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${Number(m.trust_score) >= 8 ? 'bg-emerald-500/20 text-emerald-500' : Number(m.trust_score) >= 6 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                      {m.trust_score}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8 text-muted">No market data available.</div>
      )}
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

function renderLinks(exchange: ExchangeDetail) {
  const links: { label: string; href: string }[] = []
  if (exchange.url) links.push({ label: '🌐 Website', href: exchange.url })
  if (exchange.twitter_username) links.push({ label: '🐦 Twitter', href: `https://twitter.com/${exchange.twitter_username}` })
  if (links.length === 0) return null
  return (
    <div className="flex gap-4 flex-wrap text-sm">
      {links.map(l => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-accent">{l.label}</a>
      ))}
    </div>
  )
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"|on\w+='[^']*'/gi, '')
}

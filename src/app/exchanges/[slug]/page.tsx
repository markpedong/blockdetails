import { getExchangeList, getExchangeDetail, getExchangeMarkets } from '@/lib/exchange'
import { formatCompact, formatPrice } from '@/lib/format'

export async function generateStaticParams() {
  const list = await getExchangeList()
  return list.map(e => ({ slug: e.id }))
}

export const revalidate = 600

export default async function ExchangeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let exchange: Awaited<ReturnType<typeof getExchangeDetail>> = null
  try { exchange = await getExchangeDetail(slug) } catch {}

  let markets: Awaited<ReturnType<typeof getExchangeMarkets>> = []
  try { markets = await getExchangeMarkets(slug) } catch {}

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
      <div className="flex items-start gap-4">
        <img src={exchange.image} alt={`${exchange.name} logo`} className="w-12 h-12 rounded-full" />
        <div>
          <h1 className="text-xl font-bold">{exchange.name}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm">
            <TrustBadge score={exchange.trust_score} />
            {exchange.established && (
              <span className="text-muted">Established: {exchange.established}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <Stat label="Markets" value={exchange.markets?.toLocaleString() ?? '-'} />
        <Stat label="24h Volume" value={formatCompact(exchange.total_24h_volume?.usd ?? 0)} />
        <Stat label="Reported Volume" value={formatCompact(exchange.reported_volume_24h_usd ?? 0)} />
        <Stat label="Trading Score" value={exchange.trading_volume_score?.toFixed(1) ?? '-'} />
      </div>

      {/* Links */}
      <div className="flex gap-4 flex-wrap text-sm">
        {exchange.urls?.website?.[0] && (
          <a href={sanitizeUrl(exchange.urls.website[0])} target="_blank" rel="noopener noreferrer" className="text-accent">🌐 Website</a>
        )}
        {exchange.urls?.twitter_username && (
          <a href={`https://twitter.com/${exchange.urls.twitter_username}`} target="_blank" rel="noopener noreferrer" className="text-accent">🐦 Twitter</a>
        )}
        {exchange.urls?.subreddit_url && (
          <a href={sanitizeUrl(exchange.urls.subreddit_url)} target="_blank" rel="noopener noreferrer" className="text-accent">💬 Reddit</a>
        )}
      </div>

      {/* Description — sanitized */}
      {exchange.description?.en && (
        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizeHtml(exchange.description.en) }} />
      )}

      {/* Markets table */}
      <h2 className="font-semibold">Markets</h2>
      {markets.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-xs border-b border-border">
              <th className="text-left py-2 pl-4 font-normal">Pair</th>
              <th className="text-right py-2 px-4 font-normal">Price</th>
              <th className="text-right py-2 px-4 font-normal">24h Volume</th>
              <th className="text-right py-2 px-4 hidden sm:table-cell">Trust Score</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m, i) => (
              <tr key={`${m.base}-${m.quote}-${i}`} className="border-b border-border/50">
                <td className="pl-4 pr-4 font-medium">{m.base}/{m.quote}</td>
                <td className="text-right py-2 px-4">{formatPrice(m.last, 'usd')}</td>
                <td className="text-right py-2 px-4">{formatCompact(m.total_volume?.usd ?? 0)}</td>
                <td className="text-right py-2 px-4 hidden sm:table-cell">{m.trust_score ?? '-'}</td>
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

function TrustBadge({ score }: { score: number }) {
  const cls = score >= 8 ? 'bg-emerald-500/20 text-emerald-500' : score >= 6 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>Trust Score: {score}</span>
}

/** Strip URLs to http/https only; reject javascript: etc. */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '#'
    return url
  } catch {
    return '#'
  }
}

/** Minimal HTML sanitizer: strip <script>, <style>, event handlers, javascript: URLs. */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"|on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, 'unsafe:')
}

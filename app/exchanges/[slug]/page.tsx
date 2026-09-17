import { formatCompact, formatNum } from '@/lib/utils'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Globe, ExternalLink, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

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

const ExchangeDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
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
        <h1 className="text-xl font-semibold text-[var(--negative)]">Exchange not found</h1>
        <p className="text-muted-foreground text-sm">This exchange may have been delisted or the ID is incorrect.</p>
        <Link href="/exchanges" className="inline-block text-sm bg-accent text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
          ← Back to Exchanges
        </Link>
      </div>
    )
  }

  const pairs = apiRes?.pairs ?? []

  return (
    <div className="space-y-6">
      <nav className="text-xs text-muted-foreground flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/exchanges" className="hover:text-foreground transition-colors">Exchanges</Link>
        <span>/</span>
        <span className="text-foreground">{exchange.name}</span>
      </nav>

      <div className="flex items-start gap-3 flex-wrap">
        {exchange.image && (
          <img src={exchange.image} alt="" className="w-8 h-8 rounded-full" />
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{exchange.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            {exchange.trust_score ? <TrustScore score={exchange.trust_score} /> : null}
            {exchange.year_established && (
              <span className="text-xs text-muted-foreground">Est. {exchange.year_established}</span>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-sm font-semibold mb-3">Exchange Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
          <StatRow label="24h Volume (BTC)" value={formatCompact(exchange.total_volume_btc_24h ?? 0)} />
          <StatRow label="Total Volume (BTC)" value={formatCompact(exchange.total_volume_24h_btc ?? 0)} />
          <StatRow label="Coin Markets" value={(exchange.num_coin_markets ?? 0).toString()} />
          <StatRow label="Quote Assets" value={(exchange.num_quote_assets ?? 0).toString()} />
          <StatRow label="Market Share" value={exchange.market_share != null ? `${(exchange.market_share * 100).toFixed(1)}%` : '—'} />
          {exchange.country && <StatRow label="Country" value={exchange.country} />}
        </div>
      </div>

      <Separator />

      {exchange.description && (
        <div>
          <h2 className="text-sm font-semibold mb-2">About</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(exchange.description) }} />
        </div>
      )}

      {renderLinks(exchange)}

      <Separator />

      {pairs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Trading Pairs ({pairs.length})</h2>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="border-b border-border bg-muted/5 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Pair</th>
                  <th className="px-4 py-2.5 font-medium text-right">Volume (BTC)</th>
                </tr>
              </thead>
              <tbody>
                {pairs.slice(0, 100).map((pair: any) => (
                  <tr key={pair.market_id} className="border-b border-border hover:bg-muted/5">
                    <td className="px-4 py-2.5 font-medium">
                      {pair.base_symbol}/{pair.quote_symbol}
                    </td>
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

export default ExchangeDetailPage

const StatRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

const TrustScore = ({ score }: { score: number }) => {
  const color = score >= 7 ? 'text-[var(--positive)]' : score >= 4 ? 'text-yellow-500' : 'text-[var(--negative)]'
  return (
    <Badge variant="outline" className={`tabular-nums ${color}`}>
      {score}/10
    </Badge>
  )
}

const renderLinks = (exchange: any) => {
  const links: { icon?: React.ReactNode; label: string; href: string }[] = []
  if (exchange.url) links.push({ icon: <Globe className="w-3.5 h-3.5" />, label: 'Website', href: sanitizeUrl(exchange.url) })
  if (exchange.market_center_url) links.push({ icon: <ExternalLink className="w-3.5 h-3.5" />, label: 'Trade', href: sanitizeUrl(exchange.market_center_url) })
  if (links.length === 0) return null

  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">Links</h2>
      <div className="flex flex-wrap gap-2">
        {links.map(l => (
          <Button key={l.label} variant="outline" size="sm">
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              {l.icon}
              <span>{l.label}</span>
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}

const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '#'
    return url
  } catch { return '#' }
}

const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"|on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, 'unsafe:')
}

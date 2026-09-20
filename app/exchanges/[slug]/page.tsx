import { formatCompact, sanitizeUrl } from '@/lib/utils'
import { getExchange, CryptoError, type ExchangeDetail, type Exchange } from '@/lib/crypto/service'
import { notFound } from 'next/navigation'
import { ErrorState } from '@/components/error-state'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Globe, ExternalLink } from 'lucide-react'
import { StatRow } from '@/components/stat-row'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { exchange: ex } = await getExchange(slug)
    if (ex) {
      return {
        title: `${ex.name} Exchange — Volume, Trust Score & Markets | BlockDetails`,
        description: `View ${ex.name} exchange data, trust score, trading volume, and supported markets.`,
        openGraph: { title: `${ex.name} | BlockDetails`, description: `Real-time ${ex.name} exchange data.`, type: 'website' },
      }
    }
  } catch {}
  return { title: 'Exchange Details | BlockDetails' }
}

const ExchangeDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  let apiRes: ExchangeDetail
  try { apiRes = await getExchange(slug) }
  catch (error) {
    if (error instanceof CryptoError && (error.status === 404 || error.status === 400)) notFound()
    return <div className="app-container py-6"><ErrorState message="Exchange data is temporarily unavailable. Please retry shortly." /></div>
  }
  const { exchange, pairs } = apiRes

  return (
    <div className="app-container py-6 space-y-5">
      <nav className="text-xs text-muted-foreground flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/exchanges" className="hover:text-foreground transition-colors">Exchanges</Link>
        <span>/</span>
        <span className="text-foreground">{exchange.name}</span>
      </nav>

      <div className="flex items-start gap-3 flex-wrap">
        {exchange.image && (
          <Image src={exchange.image} alt="" width={32} height={32} unoptimized className="rounded-full" />
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{exchange.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            {exchange.trust_score != null && (
              <Badge variant="outline" className={`tabular-nums text-xs ${
                exchange.trust_score >= 7 ? 'text-[var(--positive)]' : exchange.trust_score >= 4 ? 'text-yellow-500' : 'text-[var(--negative)]'
              }`}>
                {exchange.trust_score}/10
              </Badge>
            )}
            {exchange.year_established && (
              <span className="text-xs text-muted-foreground">Est. {exchange.year_established}</span>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-sm font-semibold mb-3 text-foreground">Exchange Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
          <StatRow label="24h Volume (BTC)" value={formatCompact(exchange.trade_volume_24h_btc)} />
          <StatRow label="Coins Listed" value={exchange.coins?.toString() ?? '—'} />
          <StatRow label="Trading Pairs" value={exchange.pairs?.toString() ?? '—'} />
          <StatRow label="Trust Score Rank" value={exchange.trust_score_rank ? `#${exchange.trust_score_rank}` : '—'} />
          {exchange.country && <StatRow label="Country" value={exchange.country} />}
        </div>
      </div>

      <Separator />

      {exchange.description && (
        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">About</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{exchange.description}</p>
        </div>
      )}

      {renderLinks(exchange)}

      <Separator />

      {pairs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3 text-foreground">Trading Pairs ({pairs.length})</h2>
          <div className="rounded-lg border border-border/40 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 bg-muted/20 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground">Pair</TableHead>
                  <TableHead className="text-right text-xs font-medium text-muted-foreground">Volume (BTC)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pairs.slice(0, 100).map((pair, index) => (
                  <TableRow key={`${pair.market_id}-${pair.base_symbol}-${pair.quote_symbol}-${index}`} className="border-border/40 hover:bg-muted/10 transition-colors">
                    <TableCell className="font-medium tabular-nums text-sm text-foreground">
                      {pair.base_symbol}/{pair.quote_symbol}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{formatCompact(pair.volume_btc_24h)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExchangeDetailPage

const renderLinks = (exchange: Exchange) => {
  const links: { icon?: React.ReactNode; label: string; href: string }[] = []
  if (exchange.url) links.push({ icon: <Globe className="w-3.5 h-3.5" />, label: 'Website', href: sanitizeUrl(exchange.url) })
  if (exchange.market_center_url) links.push({ icon: <ExternalLink className="w-3.5 h-3.5" />, label: 'Trade', href: sanitizeUrl(exchange.market_center_url) })
  if (links.length === 0) return null

  return (
    <div>
      <h2 className="text-sm font-semibold mb-2 text-foreground">Links</h2>
      <div className="flex flex-wrap gap-2">
        {links.map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs hover:bg-muted">
            {l.icon}<span>{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

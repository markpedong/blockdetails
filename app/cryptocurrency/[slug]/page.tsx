import { Suspense } from 'react'
import Link from 'next/link'
import { CoinChart } from '@/components/coin-chart'
import { formatPrice, formatCompact, formatNum, sanitizeUrl } from '@/lib/utils'
import { PriceChangeInline } from '@/components/ui/price-change'
import { CoinIdentity } from '@/components/ui/coin-identity'
import { StatRow } from '@/components/ui/stat-row'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ExternalLink, Globe, FileText, BookOpen } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

const CoinData = async ({ slug, currency }: { slug: string; currency: string }) => {
  let coin: any = null
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/api/coins/${slug}?vs_currency=${currency}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`,
      { next: { revalidate: 60 } }
    )
    const json = await res.json()
    coin = json.data || null
  } catch {}

  if (!coin) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Coin not found. Please check the slug.</p>
        <Link href="/cryptocurrency" className="text-accent text-sm mt-2 inline-block">
          ← Back to all coins
        </Link>
      </div>
    )
  }

  const change24h = coin.price_change_percentage_24h || 0
  const isPositive = change24h >= 0

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/cryptocurrency" className="hover:text-foreground transition-colors">Cryptocurrencies</Link>
        <span>/</span>
        <span className="text-foreground">{coin.name}</span>
      </nav>

      {/* Coin identity + price */}
      <div className="flex flex-wrap items-start gap-4">
        <CoinIdentity
          name={coin.name}
          symbol={coin.symbol}
          image={coin.image}
          rank={coin.market_cap_rank}
          size="lg"
        />
        <div className="text-right ml-auto">
          <div className="text-xs text-muted-foreground">Current Price</div>
          <div className="text-2xl sm:text-3xl font-bold tabular-nums">
            {formatPrice(coin.current_price, currency)}
          </div>
          {coin.price_change_24h != null && (
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <PriceChangeInline value={coin.price_change_percentage_24h} />
              <span className="text-muted-foreground text-xs tabular-nums">
                ({isPositive ? '+' : ''}{formatPrice(Math.abs(coin.price_change_24h), currency)})
              </span>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Chart */}
      <CoinChart coinId={coin.id} currency={currency} />

      <Separator />

      {/* Market Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Market Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
          <StatRow label="Market Cap" value={formatCompact(coin.market_cap)} />
          <StatRow label="24h Volume" value={formatCompact(coin.total_volume)} />
          <StatRow label="Circulating Supply" value={coin.circulating_supply ? formatNum(coin.circulating_supply) : '—'} />
          <StatRow label="Total Supply" value={coin.total_supply ? formatNum(coin.total_supply) : '—'} />
          <StatRow label="Max Supply" value={coin.max_supply ? formatNum(coin.max_supply) : '—'} />
          <StatRow label="All-Time High" value={coin.ath ? formatPrice(coin.ath, currency) : '—'} />
          <StatRow label="ATH Change" value={coin.ath_change_percentage != null ? `${coin.ath_change_percentage.toFixed(1)}%` : '—'} />
          <StatRow label="ATH Date" value={coin.ath_date ? new Date(coin.ath_date).toLocaleDateString() : '—'} />
          <StatRow label="All-Time Low" value={coin.atl ? formatPrice(coin.atl, currency) : '—'} />
          <StatRow label="Rank" value={`#${coin.market_cap_rank}`.replace('#NaN', '')} />
        </div>
      </div>

      <Separator />

      {/* About */}
      {coin.description?.en && (
        <div>
          <h2 className="text-lg font-semibold mb-2">About {coin.name}</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: coin.description.en.split('.').slice(0, 3).join('.') + '.' }} />
        </div>
      )}

      {/* Links */}
      {renderLinks(coin.links)}
    </div>
  )
}

const renderLinks = (links: any) => {
  if (!links) return null
  const items: { icon?: React.ReactNode; label: string; href: string }[] = []

  if (links.homepage?.[0]) items.push({ icon: <Globe className="w-3.5 h-3.5" />, label: 'Website', href: sanitizeUrl(links.homepage[0]) })
  if (links.blockchain_site?.[0]) items.push({ icon: <ExternalLink className="w-3.5 h-3.5" />, label: 'Explorer', href: sanitizeUrl(links.blockchain_site[0]) })
  if (links.twitter_screen_name) items.push({ icon: <ExternalLink className="w-3.5 h-3.5" />, label: 'X/Twitter', href: `https://twitter.com/${links.twitter_screen_name}` })
  if (links.subreddit) items.push({ icon: <BookOpen className="w-3.5 h-3.5" />, label: 'Reddit', href: `https://reddit.com/r/${links.subreddit}` })
  if (links.github?.length) items.push({ icon: <ExternalLink className="w-3.5 h-3.5" />, label: 'GitHub', href: links.github[0] })
  if (links.whitepaper?.length) items.push({ icon: <FileText className="w-3.5 h-3.5" />, label: 'Whitepaper', href: links.whitepaper[0] })

  if (items.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Links</h2>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

const CoinDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <div className="app-container py-6">
      <Suspense fallback={<Skeleton className="h-[500px] rounded-lg" />}>
        <CoinDataWithParams params={params} />
      </Suspense>
    </div>
  )
}

export default CoinDetailPage

const CoinDataWithParams = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  return <CoinData slug={slug} currency="usd" />
}

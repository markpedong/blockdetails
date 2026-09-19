import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CoinChart } from '@/components/coin-chart'
import { formatPrice, formatCompact, formatNum, formatDate, sanitizeUrl } from '@/lib/utils'
import { PriceChangeInline } from '@/components/price-change'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/cryptocurrency" className="hover:text-foreground transition-colors">Cryptocurrencies</Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground font-medium">{coin.name}</span>
      </nav>

      {/* Hero: identity + price */}
      <div className="flex flex-wrap items-center gap-4">
        {coin.image && (
          <Image
            src={coin.image}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
          />
        )}
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{coin.name}</h1>
          <span className="text-sm text-muted-foreground uppercase font-medium">{coin.symbol}</span>
          {coin.market_cap_rank && (
            <Badge variant="secondary" className="text-xs font-normal">Rank #{coin.market_cap_rank}</Badge>
          )}
        </div>
        <div className="text-right ml-auto">
          <div className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight text-foreground">
            {formatPrice(coin.current_price, currency)}
          </div>
          <div className="flex items-center gap-2 justify-end mt-1">
            <PriceChangeInline value={coin.price_change_percentage_24h} />
            {coin.price_change_24h != null && (
              <span className="text-muted-foreground text-sm tabular-nums">
                ({isPositive ? '+' : ''}{formatPrice(Math.abs(coin.price_change_24h), currency)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <CoinChart coinId={coin.id} currency={currency} />

      {/* Market Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">Market Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
            <StatRow label="Market Cap" value={formatCompact(coin.market_cap)} />
            <StatRow label="24h Volume" value={formatCompact(coin.total_volume)} />
            <StatRow label="Circulating Supply" value={coin.circulating_supply ? formatNum(coin.circulating_supply) : '—'} />
            <StatRow label="Total Supply" value={coin.total_supply ? formatNum(coin.total_supply) : '—'} />
            <StatRow label="Max Supply" value={coin.max_supply ? formatNum(coin.max_supply) : '—'} />
            <StatRow label="All-Time High" value={coin.ath ? formatPrice(coin.ath, currency) : '—'} />
            <StatRow label="ATH Change" value={coin.ath_change_percentage != null ? `${coin.ath_change_percentage.toFixed(1)}%` : '—'} />
            <StatRow label="ATH Date" value={formatDate(coin.ath_date)} />
            <StatRow label="All-Time Low" value={coin.atl ? formatPrice(coin.atl, currency) : '—'} />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      {coin.description?.en && (
        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">About {coin.name}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: coin.description.en.split('.').slice(0, 3).join('.') + '.' }} />
        </div>
      )}

      {/* Links */}
      {renderLinks(coin.links)}
    </div>
  )
}

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
    <div className="text-sm font-medium tabular-nums text-foreground">{value}</div>
  </div>
)

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
      <h2 className="text-lg font-semibold mb-3 text-foreground">Resources</h2>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

const CoinDetailPage = ({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ currency?: string }> }) => {
  return (
    <div className="app-container py-6">
      <Suspense fallback={<Skeleton className="h-[500px] rounded-lg" />}>
        <CoinDataWithParams params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default CoinDetailPage

const CoinDataWithParams = async ({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ currency?: string }> }) => {
  const { slug } = await params
  const sp = await searchParams
  const currency = sp.currency || 'usd'
  return <CoinData slug={slug} currency={currency} />
}

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CoinChart } from '@/components/coin-chart'
import { formatPrice, formatCompact, formatNum } from '@/lib/utils'
import { PriceChangeInline } from '@/components/ui/price-change'
import { CoinIdentity } from '@/components/ui/coin-identity'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ExternalLink, Globe, FileText } from 'lucide-react'
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
      <nav className="text-xs text-muted-foreground flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/cryptocurrency" className="hover:text-foreground transition-colors">Cryptocurrencies</Link>
        <span>/</span>
        <span className="text-foreground">{coin.name}</span>
      </nav>

      <div className="flex flex-wrap items-start gap-4">
        {coin.image && (
          <Image
            src={coin.image}
            alt=""
            width={32}
            height={32}
            className="rounded-full"
            unoptimized
          />
        )}
        <div className="flex-1 min-w-0">
          <CoinIdentity
            name={coin.name}
            symbol={coin.symbol}
            rank={coin.market_cap_rank}
            size="lg"
          />
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Current Price</div>
          <div className="text-xl sm:text-2xl font-bold tabular-nums">
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

      <CoinChart coinId={coin.id} currency={currency} />

      <Separator />

      <div>
        <h2 className="text-sm font-semibold mb-3">Market Statistics</h2>
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

      {coin.description?.en && (
        <div>
          <h2 className="text-sm font-semibold mb-2">About {coin.name}</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: coin.description.en.split('.').slice(0, 3).join('.') + '.' }} />
        </div>
      )}

      {renderLinks(coin.links)}
    </div>
  )
}

const StatRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

const renderLinks = (links: any) => {
  if (!links) return null
  const items: { icon?: React.ReactNode; label: string; href: string }[] = []

  if (links.homepage?.[0]) items.push({ icon: <Globe className="w-3.5 h-3.5" />, label: 'Website', href: sanitizeUrl(links.homepage[0]) })
  if (links.blockchain_site?.[0]) items.push({ icon: <ExternalLink className="w-3.5 h-3.5" />, label: 'Explorer', href: sanitizeUrl(links.blockchain_site[0]) })
  if (links.twitter_screen_name) items.push({ icon: <ExternalLink className="w-3.5 h-3.5" />, label: 'X/Twitter', href: `https://twitter.com/${links.twitter_screen_name}` })
  if (links.subreddit) items.push({ label: 'Reddit', href: `https://reddit.com/r/${links.subreddit}` })
  if (links.github?.length) items.push({ icon: <ExternalLink className="w-3.5 h-3.5" />, label: 'GitHub', href: links.github[0] })
  if (links.whitepaper?.length) items.push({ icon: <FileText className="w-3.5 h-3.5" />, label: 'Whitepaper', href: links.whitepaper[0] })

  if (items.length === 0) return null

  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">Links</h2>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <Button key={item.label} variant="outline" size="sm">
            <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              {item.icon}
              <span>{item.label}</span>
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

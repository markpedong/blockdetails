import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CoinChart } from '@/components/coin-chart'
import { formatPrice, formatCompact, formatNum, formatDate, sanitizeUrl } from '@/lib/utils'
import { PriceChangeInline } from '@/components/price-change'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { getCoin, CryptoError, type Coin } from '@/lib/crypto/service'
import { ErrorState } from '@/components/error-state'
import { WatchlistButton } from '@/components/watchlist-button'
import { MarketPairs } from '@/components/market-pairs'
import { parseCurrencyFromUrl } from '@/lib/currency'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

const CoinData = async ({ slug, currency }: { slug: string; currency: string }) => {
  let coin: Coin
  try { coin = await getCoin(slug, currency) }
  catch (error) {
    if (error instanceof CryptoError && (error.status === 404 || error.status === 400)) notFound()
    return <ErrorState message="Coin data is temporarily unavailable. Please retry shortly." />
  }

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
          <WatchlistButton coinId={coin.id} />
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
                ({coin.price_change_24h > 0 ? '+' : ''}{formatPrice(coin.price_change_24h, currency)})
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
      {coin.description && (
        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">About {coin.name}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{coin.description}</p>
        </div>
      )}

      {/* Links */}
      {renderLinks(coin.links)}
      {Object.keys(coin.platforms).length > 0 && <section className="space-y-2"><h2 className="text-lg font-semibold">Contract addresses</h2>{Object.entries(coin.platforms).map(([platform, address]) => <p key={platform} className="text-sm break-all"><strong>{platform}:</strong> <code>{address}</code></p>)}</section>}
      <Suspense fallback={<Skeleton className="h-48" />}><MarketPairs id={coin.id} /></Suspense>
    </div>
  )
}

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
    <div className="text-sm font-medium tabular-nums text-foreground">{value}</div>
  </div>
)

const renderLinks = (links: Coin['links']) => {
  const items = links.map(link => ({ label: link.label, href: sanitizeUrl(link.url) })).filter(link => link.href !== '#')

  if (items.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-foreground">Resources</h2>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
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
  const currency = await parseCurrencyFromUrl(Promise.resolve(sp))
  return <CoinData slug={slug} currency={currency} />
}

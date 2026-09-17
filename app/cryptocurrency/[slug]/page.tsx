import { formatPrice, formatCompact, formatPct, pctColor } from '@/lib/format'
import { SUPPORTED_CURRENCIES, parseCurrencyFromUrl, persistCurrency, type Currency } from '@/lib/currency'
import { CoinChart } from '@/app/components/coin-chart'
import { WatchlistButton } from '@/app/components/watchlist-button'
import type { CoinDetail, MarketChartPoint } from '@/lib/crypto'
import Link from 'next/link'

export async function generateStaticParams() {
  try {
    const res = await fetch('/api/coins/list', { next: { revalidate: 86400 } })
    const json = await res.json()
    return (json.data as { id: string }[]).slice(0, 50).map(c => ({ slug: c.id }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/coins/${slug}`)
    const json = await res.json()
    if (json.data?.coin) {
      const coin = json.data.coin
      return {
        title: `${coin.name} (${coin.symbol.toUpperCase()}) Price, Market Cap, Charts | BlockDetails`,
        description: `View real-time ${coin.name} price, market cap, charts, and supply data.`,
        openGraph: { title: `${coin.name} (${coin.symbol.toUpperCase()}) | BlockDetails`, description: `Real-time ${coin.name} market data.`, type: 'website' },
      }
    }
  } catch { /* fall through to default */ }
  return { title: 'Cryptocurrency Details | BlockDetails' }
}

type CoinApiResponse = { coin?: CoinDetail; chart?: MarketChartPoint[] }

export default async function CoinDetailPage({ searchParams, params }: { searchParams: Promise<{ currency?: string }>; params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let currency: Currency = 'usd'
  try { currency = await parseCurrencyFromUrl(searchParams as Promise<{ currency?: string }>) } catch {}
  persistCurrency(currency)

  let apiRes: CoinApiResponse | null = null
  try {
    const res = await fetch(`/api/coins/${slug}?currency=${currency}`)
    const json = await res.json()
    if (json.data?.coin) apiRes = json.data as CoinApiResponse
  } catch {}

  const coin = apiRes?.coin ?? null

  if (!coin) {
    return (
      <div className="text-center py-24 space-y-3">
        <h1 className="text-xl font-semibold text-red-500">Coin not found</h1>
        <p className="text-muted text-sm">This coin may have been delisted or the ID is incorrect.</p>
      </div>
    )
  }

  const fdv = coin.fully_diluted_valuation

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3 flex-wrap">
        {coin.image && <img src={coin.image} alt="" className="w-8 h-8 rounded-full" />}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">{coin.name}</h1>
            <span className="text-muted text-sm">/{coin.symbol.toUpperCase()}</span>
            {coin.market_cap_rank && (
              <span className="text-[10px] bg-muted/10 text-muted px-2 py-0.5 rounded-full">#{coin.market_cap_rank}</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xl font-bold">{formatPrice(coin.current_price, currency)}</span>
            <WatchlistButton coinId={coin.id} />
          </div>
        </div>
      </div>

      {/* Currency selector */}
      <CurrencySelector currency={currency} baseHref={`/cryptocurrency/${coin.id}`} />

      {/* Price change badges */}
      <PriceBadges coin={coin} currency={currency} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatRow label="Market Cap" value={formatCompact(coin.market_cap)} />
        {fdv != null && <StatRow label="FDV" value={formatCompact(fdv)} />}
        <StatRow label="24h Volume" value={formatCompact(coin.total_volume)} />
        <StatRow label="Circulating Supply" value={formatCompact(coin.circulating_supply)} />
        {coin.high_24h && <StatRow label="24h High" value={formatPrice(coin.high_24h, currency)} />}
        {coin.low_24h && <StatRow label="24h Low" value={formatPrice(coin.low_24h, currency)} />}
        {coin.ath && <StatRow label="ATH" value={`${formatPrice(coin.ath, currency)} (${coin.ath_change_percentage?.toFixed(1) ?? '—'}%)`} />}
        {coin.atl && <StatRow label="ATL" value={`${formatPrice(coin.atl, currency)} (${coin.ath_change_percentage?.toFixed(1) ?? '—'}%)`} />}
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-4">
        <CoinChart coinId={coin.id} currency={currency} />
      </div>

      {/* Supply info */}
      {(coin.circulating_supply || coin.total_supply || coin.max_supply) && (
        <div className="text-sm space-y-1">
          {coin.circulating_supply && (
            <div><span className="text-muted">Circulating: </span>{formatCompact(coin.circulating_supply)} {coin.symbol.toUpperCase()}</div>
          )}
          {coin.total_supply && (
            <div><span className="text-muted">Total Supply: </span>{formatCompact(coin.total_supply)} {coin.symbol.toUpperCase()}</div>
          )}
          {coin.max_supply && (
            <div><span className="text-muted">Max Supply: </span>{formatCompact(coin.max_supply)} {coin.symbol.toUpperCase()}</div>
          )}
        </div>
      )}

      {/* Platform */}
      {coin.platform_id && (
        <div className="text-sm"><span className="text-muted">Network: </span><span className="font-medium">{capitalize(coin.platform_id)}</span></div>
      )}

      {/* Categories */}
      {coin.categories && coin.categories.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {coin.categories.map(cat => (
            <span key={cat} className="text-[10px] bg-muted/10 text-muted px-2 py-0.5 rounded-full">{cat}</span>
          ))}
        </div>
      )}

      {/* Description */}
      {coin.description && (
        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizeHtml(coin.description) }} />
      )}

      {/* Links */}
      {renderLinks(coin!)}
    </div>
  )
}

function CurrencySelector({ currency, baseHref }: { currency: string; baseHref: string }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {SUPPORTED_CURRENCIES.map(c => (
        <Link
          key={c}
          href={`${baseHref}${currency !== c ? `?currency=${c}` : ''}`}
          className={`px-2.5 py-1 text-xs rounded-md border transition ${currency === c ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
        >
          {c.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}

function PriceBadges({ coin, currency }: { coin: CoinDetail; currency: string }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {coin.price_change_percentage_1h_in_currency != null && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${pctColor(coin.price_change_percentage_1h_in_currency)}`}>
          {formatPct(coin.price_change_percentage_1h_in_currency)} (1h)
        </span>
      )}
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${pctColor(coin.price_change_percentage_24h)}`}>
        {formatPct(coin.price_change_percentage_24h)} (24h)
      </span>
      {coin.price_change_percentage_7d_in_currency != null && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${pctColor(coin.price_change_percentage_7d_in_currency)}`}>
          {formatPct(coin.price_change_percentage_7d_in_currency)} (7D)
        </span>
      )}
      {coin.price_change_percentage_30d_in_currency != null && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${pctColor(coin.price_change_percentage_30d_in_currency)}`}>
          {formatPct(coin.price_change_percentage_30d_in_currency)} (30D)
        </span>
      )}
      {coin.price_change_percentage_60d_in_currency != null && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${pctColor(coin.price_change_percentage_60d_in_currency)}`}>
          {formatPct(coin.price_change_percentage_60d_in_currency)} (60D)
        </span>
      )}
      {coin.price_change_percentage_1y_in_currency != null && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${pctColor(coin.price_change_percentage_1y_in_currency)}`}>
          {formatPct(coin.price_change_percentage_1y_in_currency)} (1Y)
        </span>
      )}
    </div>
  )
}

function renderLinks(coin: CoinDetail) {
  const links: { label: string; href: string }[] = []
  if (coin.homepage?.[0]) links.push({ label: '🌐 Website', href: sanitizeUrl(coin.homepage[0]) })
  if (coin.blockchain_site?.[0]) links.push({ label: '📊 Block Explorer', href: sanitizeUrl(coin.blockchain_site[0]) })
  if (coin.official_forum_url?.[0]) links.push({ label: '💬 Forum', href: sanitizeUrl(coin.official_forum_url[0]) })
  if (coin.subreddit_url?.[0]) links.push({ label: '💬 Reddit', href: sanitizeUrl(coin.subreddit_url[0]) })
  if (coin.announcement_urls?.[0]) links.push({ label: '📢 Announcements', href: sanitizeUrl(coin.announcement_urls[0]) })
  const repo = Object.values(coin.repos_url).find(Boolean)
  if (repo) links.push({ label: '📦 GitHub', href: sanitizeUrl(repo as string) })

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
  } catch {
    return '#'
  }
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"|on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, 'unsafe:')
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card p-3">
      <div className="text-muted text-[10px] uppercase tracking-wide">{label}</div>
      <div className="font-semibold mt-0.5 text-xs sm:text-sm">{value}</div>
    </div>
  )
}

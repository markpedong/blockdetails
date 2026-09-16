import { getCoinDetail, getMarketChart } from '../../../lib/crypto'
import { formatPrice, formatCompact, formatPct, pctColor } from '../../../lib/format'
import { SUPPORTED_CURRENCIES, parseCurrencyFromUrl, persistCurrency } from '../../../lib/currency'
import { CoinChart } from '../../components/coin-chart'
import { WatchlistButton } from '../../components/watchlist-button'
import { Stat as StatComp } from '../../components/ui/stat'
import Link from 'next/link'

export async function generateStaticParams() {
  try {
    const coins = await fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=false', {
      next: { revalidate: 86400 },
    }).then(r => r.json())
    return coins.slice(0, 50).map((c: { id: string }) => ({ slug: c.id }))
  } catch { return [] }
}

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const coin = await getCoinDetail(slug)
    if (coin) {
      return {
        title: `${coin.name} (${coin.symbol.toUpperCase()}) Price, Market Cap, Charts | BlockDetails`,
        description: `View real-time ${coin.name} price, market cap, charts, and supply data.`,
        openGraph: { title: `${coin.name} (${coin.symbol.toUpperCase()}) | BlockDetails`, description: `Real-time ${coin.name} market data.`, type: 'website' },
      }
    }
  } catch { /* fall through to default */ }
  return { title: 'Cryptocurrency Details | BlockDetails' }
}

export default async function CoinDetailPage({ searchParams, params }: { searchParams: Promise<{ currency?: string }>; params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const currency = await parseCurrencyFromUrl(searchParams as unknown as Promise<Record<string, string | undefined>>)
  persistCurrency(currency)

  let coin: Awaited<ReturnType<typeof getCoinDetail>> | null = null
  try { coin = await getCoinDetail(slug) } catch {}

  if (!coin) {
    return (
      <div className="text-center py-24">
        <h1 className="text-xl font-semibold text-red-500">Coin not found</h1>
        <p className="text-muted mt-2">This coin may have been delisted or the ID is incorrect.</p>
      </div>
    )
  }

  const price = coin.market_data?.current_price?.[currency] ?? coin.current_price
  const fdv = coin.market_data?.fully_diluted_valuation

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <img src={coin.image} alt={`${coin.name} logo`} className="w-10 h-10 rounded-full" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{coin.name}</h1>
            <span className="text-muted text-sm">/{coin.symbol.toUpperCase()}</span>
            {coin.market_cap_rank && (
              <span className="text-xs bg-muted/10 text-muted px-2 py-0.5 rounded-full">#{coin.market_cap_rank}</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-bold">{formatPrice(price, currency)}</span>
            <WatchlistButton coinId={coin.id} />
          </div>
        </div>
      </div>

      {/* Currency selector */}
      <CurrencySelector currency={currency} baseHref={`/cryptocurrency/${coin.id}`} />

      {/* Price stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <StatComp label="Market Cap" value={formatCompact(coin.market_cap)} />
        {fdv != null && <StatComp label="FDV" value={formatCompact(fdv)} />}
        <StatComp label="24h Volume" value={formatCompact(coin.total_volume)} />
        <StatComp label="Circulating Supply" value={formatCompact(coin.circulating_supply)} />
      </div>

      {/* Price change badges */}
      <PriceBadges coin={coin} currency={currency} />

      {/* Chart */}
      <CoinChart coinId={coin.id} currency={currency} />

      {/* High/Low 24h */}
      {(coin.high_24h || coin.low_24h) && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          {coin.high_24h && <StatComp label="24h High" value={formatPrice(coin.high_24h, currency)} />}
          {coin.low_24h && <StatComp label="24h Low" value={formatPrice(coin.low_24h, currency)} />}
        </div>
      )}

      {/* ATH / ATL */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {coin.ath && (
          <div>
            <div className="text-muted text-xs">All-Time High</div>
            <div>{formatPrice(coin.ath, currency)}</div>
            {coin.market_data?.ath_change_percentage && currency in coin.market_data.ath_change_percentage && (
              <div className={`text-xs ${pctColor(coin.market_data.ath_change_percentage[currency] ?? 0)}`}>
                {formatPct(coin.market_data.ath_change_percentage[currency] ?? 0)} from ATH
              </div>
            )}
          </div>
        )}
        {coin.atl && (
          <div>
            <div className="text-muted text-xs">All-Time Low</div>
            <div>{formatPrice(coin.atl, currency)}</div>
            {coin.market_data?.atl_change_percentage && currency in coin.market_data.atl_change_percentage && (
              <div className={`text-xs ${pctColor(coin.market_data.atl_change_percentage[currency] ?? 0)}`}>
                {formatPct(coin.market_data.atl_change_percentage[currency] ?? 0)} from ATL
              </div>
            )}
          </div>
        )}
      </div>

      {/* Supply info */}
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

      {/* Contract addresses */}
      {renderContractAddresses(coin)}

      {/* Categories */}
      {coin.categories && coin.categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {coin.categories.map(cat => (
            <span key={cat} className="text-xs bg-muted/10 text-muted px-2 py-1 rounded-full">{cat}</span>
          ))}
        </div>
      )}

      {/* Description — sanitized */}
      {coin.description?.en && (
        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizeHtml(coin.description.en) }} />
      )}

      {/* Links */}
      {coin.links && (
        <div className="flex gap-4 flex-wrap text-sm">
          {coin.links.website?.[0] && (
            <a href={sanitizeUrl(coin.links.website[0])} target="_blank" rel="noopener noreferrer" className="text-accent">🌐 Website</a>
          )}
          {coin.links.blockchain_site?.[0] && (
            <a href={sanitizeUrl(coin.links.blockchain_site[0])} target="_blank" rel="noopener noreferrer" className="text-accent">📊 Block Explorer</a>
          )}
          {coin.links.subreddit_url?.[0] && (
            <a href={sanitizeUrl(coin.links.subreddit_url[0])} target="_blank" rel="noopener noreferrer" className="text-accent">💬 Reddit</a>
          )}
          {coin.links.announcement_url?.[0] && (
            <a href={sanitizeUrl(coin.links.announcement_url[0])} target="_blank" rel="noopener noreferrer" className="text-accent">📢 Announcements</a>
          )}
          {(() => {
            const repo = Object.values(coin.links.repos_url).find(Boolean)
            if (!repo) return null
            return <a href={sanitizeUrl(repo as unknown as string)} target="_blank" rel="noopener noreferrer" className="text-accent">📦 GitHub</a>
          })()}
        </div>
      )}
    </div>
  )
}

function CurrencySelector({ currency, baseHref }: { currency: string; baseHref: string }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {SUPPORTED_CURRENCIES.map(c => (
        <Link
          key={c}
          href={`${baseHref}${currency !== c ? `?currency=${c}` : ''}`}
          className={`px-3 py-1 text-xs rounded-full border transition ${currency === c ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
        >
          {c.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}

function PriceBadges({ coin, currency }: { coin: Awaited<ReturnType<typeof getCoinDetail>>; currency: string }) {
  const md = coin.market_data
  return (
    <div className="flex gap-2 flex-wrap">
      {coin.price_change_percentage_1h_in_currency != null && (
        <span className={`text-xs px-2 py-1 rounded-full ${pctColor(coin.price_change_percentage_1h_in_currency)}`}>
          {formatPct(coin.price_change_percentage_1h_in_currency)} (1h)
        </span>
      )}
      <span className={`text-xs px-2 py-1 rounded-full ${pctColor(coin.price_change_percentage_24h)}`}>
        {formatPct(coin.price_change_percentage_24h)} (24h)
      </span>
      {coin.price_change_percentage_7d_in_currency != null && (
        <span className={`text-xs px-2 py-1 rounded-full ${pctColor(coin.price_change_percentage_7d_in_currency)}`}>
          {formatPct(coin.price_change_percentage_7d_in_currency)} (7D)
        </span>
      )}
      {md?.price_change_percentage_30d_in_currency && currency in md.price_change_percentage_30d_in_currency && md.price_change_percentage_30d_in_currency[currency] != null && md.price_change_percentage_30d_in_currency[currency] !== 0 && (
        <span className={`text-xs px-2 py-1 rounded-full ${pctColor(md.price_change_percentage_30d_in_currency[currency])}`}>
          {formatPct(md.price_change_percentage_30d_in_currency[currency])} (30D)
        </span>
      )}
      {md?.price_change_percentage_60d_in_currency && currency in md.price_change_percentage_60d_in_currency && md.price_change_percentage_60d_in_currency[currency] != null && md.price_change_percentage_60d_in_currency[currency] !== 0 && (
        <span className={`text-xs px-2 py-1 rounded-full ${pctColor(md.price_change_percentage_60d_in_currency[currency])}`}>
          {formatPct(md.price_change_percentage_60d_in_currency[currency])} (60D)
        </span>
      )}
      {md?.price_change_percentage_1y_in_currency && currency in md.price_change_percentage_1y_in_currency && md.price_change_percentage_1y_in_currency[currency] != null && md.price_change_percentage_1y_in_currency[currency] !== 0 && (
        <span className={`text-xs px-2 py-1 rounded-full ${pctColor(md.price_change_percentage_1y_in_currency[currency])}`}>
          {formatPct(md.price_change_percentage_1y_in_currency[currency])} (1Y)
        </span>
      )}
    </div>
  )
}

function renderContractAddresses(coin: Awaited<ReturnType<typeof getCoinDetail>>) {
  // CoinGecko returns contract_address on platform coins via the platform_id field
  // and additional platform info in the response. We check for contract addresses
  // by looking at coins that have a platform_id (meaning they're tokens on another chain).
  if (!coin.platform_id) return null

  // For platform coins, the contract address is embedded in the CoinGecko response
  // under a "contract_address" field on the platform object. Since our CoinDetail type
  // doesn't capture this, we check if there's platform info.
  // The CoinGecko API v3 /coins/{id} response includes a "platform" field for platform coins
  // with the contract address. We'll display it if available via a workaround:
  // Check if any link points to an explorer that reveals the contract.

  // Actually, CoinGecko v3 /coins/{id} returns a "platform" field (string) for platform coins,
  // and the contract address is NOT directly exposed in v3. It IS available in v3/coins/{id}/contract_address
  // but that's a separate endpoint. For now, we note platform_id as the network.
  return (
    <div className="text-sm">
      <span className="text-muted">Network: </span>
      <span className="font-medium">{capitalize(coin.platform_id)}</span>
    </div>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
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

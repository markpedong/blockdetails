import { getCoinDetail, getMarketChart } from '@/lib/crypto'
import { formatPrice, formatCompact, formatPct, pctColor } from '@/lib/format'
import { CoinChart } from '@/app/components/coin-chart'
import { WatchlistButton } from '@/app/components/watchlist-button'

export async function generateStaticParams() {
  try {
    const coins = await fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=false', {
      next: { revalidate: 86400 }
    }).then(r => r.json())
    return coins.slice(0, 50).map((c: { id: string }) => ({ slug: c.id }))
  } catch { return [] }
}

export const revalidate = 300

export default async function CoinDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

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

  const currency = 'usd'
  const price = coin.market_data?.current_price?.[currency] ?? coin.current_price

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

      {/* Price stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <Stat label="Market Cap" value={formatCompact(coin.market_cap)} />
        <Stat label="24h Volume" value={formatCompact(coin.total_volume)} />
        <Stat label="Circulating Supply" value={formatCompact(coin.circulating_supply)} />
        <Stat label="Max Supply" value={coin.max_supply ? formatCompact(coin.max_supply) : '∞'} />
      </div>

      {/* Price change badges */}
      <div className="flex gap-2 flex-wrap">
        {coin.price_change_percentage_1h_in_currency != null && (
          <span className={`text-xs px-2 py-1 rounded-full ${pctColor(coin.price_change_percentage_1h_in_currency)}`}>
            {formatPct(coin.price_change_percentage_1h_in_currency)} (1h)
          </span>
        )}
        <span className={`text-xs px-2 py-1 rounded-full ${pctColor(coin.price_change_percentage_24h)}`}>
          {formatPct(coin.price_change_percentage_24h)} (24h)
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${pctColor(coin.price_change_percentage_7d_in_currency)}`}>
          {formatPct(coin.price_change_percentage_7d_in_currency)} (7d)
        </span>
      </div>

      {/* Chart */}
      <CoinChart coinId={coin.id} currency={currency} />

      {/* High/Low 24h */}
      {(coin.high_24h || coin.low_24h) && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          {coin.high_24h && <Stat label="24h High" value={formatPrice(coin.high_24h, currency)} />}
          {coin.low_24h && <Stat label="24h Low" value={formatPrice(coin.low_24h, currency)} />}
        </div>
      )}

      {/* ATH / ATL */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {coin.ath && (
          <div>
            <div className="text-muted text-xs">All-Time High</div>
            <div>{formatPrice(coin.ath, currency)}</div>
            {coin.market_data?.ath_change_percentage?.[currency] != null && (
              <div className={`text-xs ${pctColor(coin.market_data.ath_change_percentage[currency])}`}>
                {formatPct(coin.market_data.ath_change_percentage[currency])} from ATH
              </div>
            )}
          </div>
        )}
        {coin.atl && (
          <div>
            <div className="text-muted text-xs">All-Time Low</div>
            <div>{formatPrice(coin.atl, currency)}</div>
            {coin.market_data?.atl_change_percentage?.[currency] != null && (
              <div className={`text-xs ${pctColor(coin.market_data.atl_change_percentage[currency])}`}>
                {formatPct(coin.market_data.atl_change_percentage[currency])} from ATL
              </div>
            )}
          </div>
        )}
      </div>

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

      {/* Categories */}
      {coin.categories && coin.categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {coin.categories.map(cat => (
            <span key={cat} className="text-xs bg-muted/10 text-muted px-2 py-1 rounded-full">{cat}</span>
          ))}
        </div>
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

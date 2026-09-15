import { getCoins, getGlobalData, getTrending } from '@/lib/crypto'
import { formatCompact, formatPct, pctColor, formatPrice } from '@/lib/format'
import { SUPPORTED_CURRENCIES, parseCurrencyFromUrl, persistCurrency } from '@/lib/currency'
import Link from 'next/link'
import { WatchlistButton } from '@/app/components/watchlist-button'
import { Stat as StatComp } from '@/app/components/ui/stat'
import { Pagination } from '@/app/components/ui/pagination'
import { SortHeader } from '@/app/components/ui/sort-header'
import type { Coin, TrendingCoin } from '@/lib/crypto'

export const metadata = {
  title: 'Cryptocurrency Prices by Market Cap | BlockDetails',
  description: 'Track real-time cryptocurrency prices, market cap, volume, and charts for thousands of digital assets.',
  openGraph: { title: 'Cryptocurrency Prices | BlockDetails', description: 'Real-time cryptocurrency market data.', type: 'website' },
}

const PER_PAGE = 50

export default async function CoinsPage({ searchParams }: { searchParams: Promise<{ currency?: string; page?: string; order?: string }> }) {
  const [currency, rawPage, rawOrder] = await Promise.all([parseCurrencyFromUrl(searchParams), (await searchParams).page, (await searchParams).order])

  const page = Math.max(1, parseInt(rawPage || '1', 10))
  const order = resolveOrder(rawOrder)

  // Persist currency preference
  persistCurrency(currency)

  let coins: Coin[] = []
  try {
    coins = await getCoins({ vs_currency: currency, order, per_page: PER_PAGE, page, sparkline: false, price_change_percentage: '1h,24h,7d' })
  } catch { /* empty on error */ }

  let global: Awaited<ReturnType<typeof getGlobalData>> | null = null
  try { global = await getGlobalData() } catch {}

  let trending: TrendingCoin[] = []
  try { trending = await getTrending() } catch {}

  const baseHref = `/cryptocurrency?currency=${currency}`

  // Fetch page 1 to determine total pages (CoinGecko doesn't return a count header)
  let firstPage: Coin[] = []
  try {
    firstPage = await getCoins({ vs_currency: currency, order, per_page: PER_PAGE, page: 1, sparkline: false })
  } catch { /* ignore */ }

  const totalPages = Math.max(1, Math.ceil(firstPage.length / PER_PAGE))

  return (
    <div className="space-y-8">
      {/* Global stats */}
      {global && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <StatComp label="Market Cap" value={formatCompact(global.total_market_cap[currency] ?? 0)} />
          <StatComp label="24h Volume" value={formatCompact(global.total_volume?.[currency] ?? 0)} />
          <StatComp label="BTC Dominance" value={`${global.btc_dominance.toFixed(1)}%`} />
          <StatComp label="Active Coins" value={formatNum(global.active_cryptocurrencies ?? 0)} />
        </div>
      )}

      {/* Currency selector */}
      <CurrencySelector currency={currency} baseHref={baseHref} />

      {/* Trending */}
      {trending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted mb-3">🔥 Trending</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trending.slice(0, 6).map(t => (
              <Link key={t.id} href={`/cryptocurrency/${t.id}`} className="flex items-center gap-2 min-w-[160px] p-3 rounded-lg border border-border bg-card hover:border-accent/50 transition">
                <img src={t.small} alt={`${t.name} logo`} className="w-6 h-6 rounded-full" />
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted">/{t.symbol.toUpperCase()} #{t.market_cap_rank}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <CoinTable coins={coins} currency={currency} currentPage={page} baseHref={baseHref} />
    </div>
  )
}

function resolveOrder(raw?: string): string | undefined {
  if (!raw) return 'market_cap_desc'
  const valid = ['market_cap_desc', 'price_desc', 'volume_desc', 'price_change_24h_desc', 'price_change_percentage_24h_desc', 'price_change_percentage_7d_desc']
  return valid.includes(raw) ? raw : 'market_cap_desc'
}

function formatNum(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

function CurrencySelector({ currency, baseHref }: { currency: string; baseHref: string }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {SUPPORTED_CURRENCIES.map(c => (
        <Link
          key={c}
          href={`${baseHref}${currency !== c ? `&currency=${c}` : ''}`}
          className={`px-3 py-1 text-xs rounded-full border transition ${currency === c ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
        >
          {c.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}

function CoinTable({ coins, currency, currentPage, baseHref }: { coins: Coin[]; currency: string; currentPage: number; baseHref: string }) {
  if (coins.length === 0) {
    return <div className="text-center py-12 text-muted">Failed to load coins. Please try again.</div>
  }

  const totalPages = Math.ceil(coins.length / PER_PAGE)
  // Extract sort from URL to pass to SortHeader
  const searchParams = new URLSearchParams(baseHref.split('?')[1] || '')
  const currentSort = searchParams.get('order') ?? 'market_cap'

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs border-b border-border">
            <th className="text-right py-2 pr-4 font-normal">#</th>
            <th className="text-left py-2 pl-4 pr-4 font-normal">Asset</th>
            <th className="text-right py-2 pr-4 font-normal">
              <SortHeader label="Price" sortKey="price" currentSort={currentSort} baseHref={`${baseHref}&order=price_desc`} />
            </th>
            <th className="text-right py-2 px-4 font-normal hidden sm:table-cell">
              <SortHeader label="1h" sortKey="1h_change" currentSort={currentSort} baseHref={`${baseHref}&order=price_change_percentage_1h_in_currency_desc`} />
            </th>
            <th className="text-right py-2 px-4 font-normal">
              <SortHeader label="24h" sortKey="24h_change" currentSort={currentSort} baseHref={`${baseHref}&order=price_change_24h_desc`} />
            </th>
            <th className="text-right py-2 px-4 font-normal hidden sm:table-cell">
              <SortHeader label="7D" sortKey="7d_change" currentSort={currentSort} baseHref={`${baseHref}&order=price_change_percentage_7d_desc`} />
            </th>
            <th className="text-right py-2 px-4 font-normal hidden md:table-cell">
              <SortHeader label="Market Cap" sortKey="market_cap" currentSort={currentSort} baseHref={`${baseHref}&order=market_cap_desc`} />
            </th>
            <th className="text-right py-2 px-4 font-normal hidden md:table-cell">
              <SortHeader label="Volume (24h)" sortKey="volume" currentSort={currentSort} baseHref={`${baseHref}&order=volume_desc`} />
            </th>
            <th className="text-right py-2 pl-4 pr-1 font-normal text-center">★</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <tr key={coin.id} className="border-b border-border/50 hover:bg-muted/5 transition">
              <td className="text-right py-3 pr-4 text-muted">{coin.market_cap_rank}</td>
              <td className="pl-4 pr-4">
                <Link href={`/cryptocurrency/${coin.id}`} className="flex items-center gap-2.5">
                  <img src={coin.image} alt={`${coin.name} logo`} className="w-6 h-6 rounded-full" />
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-muted text-xs hidden sm:inline">{coin.symbol.toUpperCase()}</span>
                </Link>
              </td>
              <td className="text-right py-3 pr-4 font-medium">{formatPrice(coin.current_price, currency)}</td>
              <td className={`text-right py-3 px-4 hidden sm:table-cell ${pctColor(coin.price_change_percentage_1h_in_currency)}`}>
                {coin.price_change_percentage_1h_in_currency != null ? formatPct(coin.price_change_percentage_1h_in_currency) : '-'}
              </td>
              <td className={`text-right py-3 px-4 ${pctColor(coin.price_change_percentage_24h)}`}>
                {coin.price_change_percentage_24h != null ? formatPct(coin.price_change_percentage_24h) : '-'}
              </td>
              <td className={`text-right py-3 px-4 hidden sm:table-cell ${pctColor(coin.price_change_percentage_7d_in_currency)}`}>
                {coin.price_change_percentage_7d_in_currency != null ? formatPct(coin.price_change_percentage_7d_in_currency) : '-'}
              </td>
              <td className="text-right py-3 px-4 hidden md:table-cell">{formatCompact(coin.market_cap)}</td>
              <td className="text-right py-3 px-4 hidden md:table-cell">{formatCompact(coin.total_volume)}</td>
              <td className="text-right py-3 pl-4 pr-1 text-center">
                <WatchlistButton coinId={coin.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={baseHref} />
    </div>
  )
}

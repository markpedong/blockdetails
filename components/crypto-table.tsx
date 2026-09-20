'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { formatPrice, formatCompact } from '@/lib/utils'
import { CoinIdentity } from '@/components/coin-identity'
import { PriceChangeInline } from '@/components/price-change'
import { WatchlistButton } from '@/components/watchlist-button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/empty-state'
import { getWatchlist } from '@/lib/storage'

export type Coin = {
  id: string
  symbol: string
  name: string
  image: string | null
  market_cap_rank: number | null
  current_price: number | null
  price_change_percentage_1h_in_currency: number | null
  price_change_percentage_24h: number | null
  price_change_percentage_7d_in_currency: number | null
  market_cap: number | null
  total_volume: number | null
  circulating_supply: number | null
  fully_diluted_valuation: number | null
}

interface CryptoTableProps {
  coins: Coin[]
  currency: string
  showRank?: boolean
  show1h?: boolean
  show7d?: boolean
  showMarketCap?: boolean
  showVolume?: boolean
  showWatchlist?: boolean
  showFilters?: boolean
  showSupply?: boolean
}

type SortKey = 'rank' | 'name' | 'price' | '1h' | '24h' | '7d' | 'market_cap' | 'volume'
type SortDir = 'asc' | 'desc'
type FilterType = 'all' | 'gainers' | 'losers' | 'watchlisted'

export function CryptoTable({
  coins,
  currency,
  showRank = true,
  show1h = true,
  show7d = true,
  showMarketCap = true,
  showVolume = true,
  showWatchlist = true,
  showFilters = false,
  showSupply = false,
}: CryptoTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [filter, setFilter] = useState<FilterType>('all')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir(key === 'rank' ? 'asc' : 'desc') }
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return coins
    if (filter === 'gainers') return [...coins].filter(c => (c.price_change_percentage_24h ?? 0) > 0).sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
    if (filter === 'losers') return [...coins].filter(c => (c.price_change_percentage_24h ?? 0) < 0).sort((a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0))
    if (filter === 'watchlisted') {
      const wl = getWatchlist()
      return coins.filter(c => wl.includes(c.id))
    }
    return coins
  }, [coins, filter])

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'rank': return dir * ((a.market_cap_rank ?? Infinity) - (b.market_cap_rank ?? Infinity))
        case 'name': return dir * a.name.localeCompare(b.name)
        case 'price': return dir * ((a.current_price ?? -Infinity) - (b.current_price ?? -Infinity))
        case '1h': return dir * ((a.price_change_percentage_1h_in_currency ?? -Infinity) - (b.price_change_percentage_1h_in_currency ?? -Infinity))
        case '24h': return dir * ((a.price_change_percentage_24h ?? -Infinity) - (b.price_change_percentage_24h ?? -Infinity))
        case '7d': return dir * ((a.price_change_percentage_7d_in_currency ?? -Infinity) - (b.price_change_percentage_7d_in_currency ?? -Infinity))
        case 'market_cap': return dir * ((a.market_cap ?? -Infinity) - (b.market_cap ?? -Infinity))
        case 'volume': return dir * ((a.total_volume ?? -Infinity) - (b.total_volume ?? -Infinity))
        default: return 0
      }
    })
  }, [filtered, sortKey, sortDir])

  const SortHeader = ({ label, sortKey: k, className = '' }: { label: string; sortKey: SortKey; className?: string }) => (
    <TableHead
      className={`${className} ${sortKey === k ? 'text-foreground' : ''}`}
      aria-sort={sortKey === k ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        onClick={() => handleSort(k)}
        className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors"
      >
        {label}
        {sortKey === k && <span className="text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </TableHead>
  )

  if (coins.length === 0) return <EmptyState message="No cryptocurrencies found." />

  return (
    <div className="space-y-3">
      {showFilters && (
        <div className="flex items-center gap-1 text-xs">
          {(['all', 'gainers', 'losers', 'watchlisted'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md transition-colors capitalize ${
                filter === f
                  ? 'bg-accent/10 text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {f === 'watchlisted' ? 'Watchlist' : f}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {showRank && <SortHeader label="#" sortKey="rank" className="w-12 text-right" />}
              <SortHeader label="Asset" sortKey="name" className="min-w-[160px]" />
              <SortHeader label="Price" sortKey="price" className="text-right" />
              {show1h && <SortHeader label="1h %" sortKey="1h" className="text-right hidden sm:table-cell" />}
              <SortHeader label="24h %" sortKey="24h" className="text-right" />
              {show7d && <SortHeader label="7d %" sortKey="7d" className="text-right hidden sm:table-cell" />}
              {showMarketCap && <SortHeader label="Market Cap" sortKey="market_cap" className="text-right hidden md:table-cell" />}
              {showVolume && <SortHeader label="Volume (24h)" sortKey="volume" className="text-right hidden lg:table-cell" />}
              {showSupply && <TableHead className="text-right hidden xl:table-cell text-xs font-medium text-muted-foreground">Supply</TableHead>}
              {showWatchlist && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(coin => (
              <TableRow key={coin.id} className="hover:bg-muted/30">
                {showRank && (
                  <TableCell className="text-right text-muted-foreground font-mono text-xs tabular-nums">
                    {coin.market_cap_rank}
                  </TableCell>
                )}
                <TableCell>
                  <Link href={`/cryptocurrency/${encodeURIComponent(coin.id)}?currency=${currency}`} className="flex items-center gap-2.5 group py-0.5">
                    <CoinIdentity
                      name={coin.name}
                      symbol={coin.symbol}
                      image={coin.image}
                      rank={showRank ? undefined : coin.market_cap_rank}
                      size="sm"
                    />
                  </Link>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums text-sm text-foreground">
                  {formatPrice(coin.current_price, currency)}
                </TableCell>
                {show1h && (
                  <TableCell className="text-right tabular-nums hidden sm:table-cell">
                    <PriceChangeInline value={coin.price_change_percentage_1h_in_currency} />
                  </TableCell>
                )}
                <TableCell className="text-right tabular-nums">
                  <PriceChangeInline value={coin.price_change_percentage_24h} />
                </TableCell>
                {show7d && (
                  <TableCell className="text-right tabular-nums hidden sm:table-cell">
                    <PriceChangeInline value={coin.price_change_percentage_7d_in_currency} />
                  </TableCell>
                )}
                {showMarketCap && (
                  <TableCell className="text-right tabular-nums text-muted-foreground hidden md:table-cell">
                    {formatCompact(coin.market_cap)}
                  </TableCell>
                )}
                {showVolume && (
                  <TableCell className="text-right tabular-nums text-muted-foreground hidden lg:table-cell">
                    {formatCompact(coin.total_volume)}
                  </TableCell>
                )}
                {showSupply && (
                  <TableCell className="text-right tabular-nums text-muted-foreground hidden xl:table-cell">
                    {coin.circulating_supply != null ? `${formatCompact(coin.circulating_supply)} ${coin.symbol?.toUpperCase()}` : '—'}
                  </TableCell>
                )}
                {showWatchlist && (
                  <TableCell className="text-center">
                    <WatchlistButton coinId={coin.id} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

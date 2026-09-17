import Link from 'next/link'
import type { Coin } from '@/lib/crypto'
import { formatPrice, formatCompact } from '@/lib/utils'
import { CoinIdentity } from './coin-identity'
import { PriceChangeInline } from './price-change'
import { WatchlistButton } from '../watchlist-button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from './empty-state'

interface CryptoTableProps {
  coins: Coin[]
  currency: string
  showRank?: boolean
  show1h?: boolean
  show7d?: boolean
  showMarketCap?: boolean
  showVolume?: boolean
  showWatchlist?: boolean
}

export function CryptoTable({
  coins,
  currency,
  showRank = true,
  show1h = true,
  show7d = true,
  showMarketCap = true,
  showVolume = true,
  showWatchlist = true,
}: CryptoTableProps) {
  if (coins.length === 0) {
    return <EmptyState message="No cryptocurrencies found." />
  }

  return (
    <div className="rounded-lg border border-border/40 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 bg-muted/20 hover:bg-transparent">
            {showRank && <TableHead className="w-10 text-right text-xs font-medium text-muted-foreground">#</TableHead>}
            <TableHead className="min-w-[140px] text-xs font-medium text-muted-foreground">Asset</TableHead>
            <TableHead className="text-right text-xs font-medium text-muted-foreground">Price</TableHead>
            {show1h && <TableHead className="text-right hidden sm:table-cell text-xs font-medium text-muted-foreground">1h</TableHead>}
            <TableHead className="text-right text-xs font-medium text-muted-foreground">24h</TableHead>
            {show7d && <TableHead className="text-right hidden sm:table-cell text-xs font-medium text-muted-foreground">7D</TableHead>}
            {showMarketCap && <TableHead className="text-right hidden md:table-cell text-xs font-medium text-muted-foreground">Market Cap</TableHead>}
            {showVolume && <TableHead className="text-right hidden lg:table-cell text-xs font-medium text-muted-foreground">Volume</TableHead>}
            {showWatchlist && <TableHead className="w-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map(coin => (
            <TableRow key={coin.id} className="border-border/50 hover:bg-muted/20">
              {showRank && (
                <TableCell className="text-right text-muted-foreground font-mono text-xs">
                  {coin.market_cap_rank}
                </TableCell>
              )}
              <TableCell>
                <Link href={`/cryptocurrency/${coin.id}`} className="flex items-center gap-2 group">
                  <CoinIdentity
                    name={coin.name}
                    symbol={coin.symbol}
                    image={coin.image}
                    rank={showRank ? undefined : coin.market_cap_rank}
                    size="sm"
                  />
                </Link>
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums text-sm">
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
                <TableCell className="text-right tabular-nums hidden md:table-cell">
                  {formatCompact(coin.market_cap)}
                </TableCell>
              )}
              {showVolume && (
                <TableCell className="text-right tabular-nums hidden lg:table-cell">
                  {formatCompact(coin.total_volume)}
                </TableCell>
              )}
              {showWatchlist && (
                <TableCell className="text-right">
                  <WatchlistButton coinId={coin.id} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

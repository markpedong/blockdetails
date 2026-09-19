import Link from 'next/link'
import { formatPrice, formatCompact } from '@/lib/utils'

export interface Coin {
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
}
import { CoinIdentity } from '@/components/coin-identity'
import { PriceChangeInline } from '@/components/price-change'
import { WatchlistButton } from '@/components/watchlist-button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/empty-state'

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
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {showRank && <TableHead className="w-12 text-right text-xs font-medium text-muted-foreground">#</TableHead>}
            <TableHead className="min-w-[160px] text-xs font-medium text-muted-foreground">Asset</TableHead>
            <TableHead className="text-right text-xs font-medium text-muted-foreground">Price</TableHead>
            {show1h && <TableHead className="text-right hidden sm:table-cell text-xs font-medium text-muted-foreground">1h %</TableHead>}
            <TableHead className="text-right text-xs font-medium text-muted-foreground">24h %</TableHead>
            {show7d && <TableHead className="text-right hidden sm:table-cell text-xs font-medium text-muted-foreground">7d %</TableHead>}
            {showMarketCap && <TableHead className="text-right hidden md:table-cell text-xs font-medium text-muted-foreground">Market Cap</TableHead>}
            {showVolume && <TableHead className="text-right hidden lg:table-cell text-xs font-medium text-muted-foreground">Volume (24h)</TableHead>}
            {showWatchlist && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map(coin => (
            <TableRow key={coin.id} className="hover:bg-muted/30">
              {showRank && (
                <TableCell className="text-right text-muted-foreground font-mono text-xs tabular-nums">
                  {coin.market_cap_rank}
                </TableCell>
              )}
              <TableCell>
                <Link href={`/cryptocurrency/${coin.id}`} className="flex items-center gap-2.5 group py-0.5">
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
  )
}

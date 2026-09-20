import Link from 'next/link'
import { getTrending } from '@/lib/crypto/service'
import { Card, CardContent } from '@/components/ui/card'
import { CoinIdentity } from '@/components/coin-identity'
import { PriceChangeInline } from '@/components/price-change'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'
import { formatPrice } from '@/lib/utils'

export async function TrendingSection({ currency, full = false }: { currency: string; full?: boolean }) {
  let coins
  try { coins = await getTrending(currency) }
  catch { return <ErrorState compact message="Trending assets are temporarily unavailable from the data provider." /> }
  return <section>
    <h2 className="text-lg font-semibold mb-3 text-foreground">Trending</h2>
    {coins.length === 0 ? <EmptyState message="No trending assets reported." /> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {(full ? coins : coins.slice(0, 6)).map((coin, i) => <Link key={coin.id} href={`/cryptocurrency/${encodeURIComponent(coin.id)}?currency=${currency}`}>
        <Card className="hover:bg-muted/30 transition-colors group h-full"><CardContent className="p-3 flex items-center gap-2.5">
          <span className="text-xs text-muted-foreground font-mono w-4 text-right shrink-0">{i + 1}</span>
          <CoinIdentity name={coin.name} symbol={coin.symbol} image={coin.image} size="sm" />
          <div className="ml-auto text-right min-w-0">
            <div className="text-sm font-medium tabular-nums text-foreground">{formatPrice(coin.current_price, currency)}</div>
            <PriceChangeInline value={coin.price_change_percentage_24h} />
          </div>
        </CardContent></Card>
      </Link>)}
    </div>}
  </section>
}

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { CoinIdentity } from '@/components/ui/coin-identity'
import { PriceChangeInline } from '@/components/ui/price-change'

const TrendingSection = async ({ currency }: { currency: string }) => {
  let trending: any[] = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/api/trending?vs_currency=${currency}`,
      { next: { revalidate: 300 } }
    )
    const json = await res.json()
    trending = (json.coins || []) as any[]
  } catch {}

  if (trending.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Trending</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {trending.slice(0, 6).map((item: any) => (
          <Link key={item.item?.id} href={`/cryptocurrency/${item.item?.id}`} className="block">
            <Card className="hover:bg-muted/30 transition-colors group h-full">
              <CardContent className="p-3 flex items-center gap-2.5">
                <CoinIdentity
                  name={item.item?.name}
                  symbol={item.item?.symbol}
                  image={item.item?.image}
                  size="sm"
                />
                <div className="ml-auto text-right">
                  {item.item?.price_change_percentage_24h != null && (
                    <PriceChangeInline value={item.item.price_change_percentage_24h} />
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export { TrendingSection }

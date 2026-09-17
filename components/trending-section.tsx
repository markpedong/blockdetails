import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export async function TrendingSection({ currency }: { currency: string }) {
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
      <h2 className="text-lg font-semibold mb-3">🔥 Trending</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {trending.slice(0, 6).map((item: any) => (
          <Link key={item.item?.id} href={`/cryptocurrency/${item.item?.id}`} className="block">
            <Card className="hover:border-accent/50 transition-colors group">
              <CardContent className="p-3 flex items-center gap-2.5">
                {item.item?.image && (
                  <img src={item.item.image} alt="" className="w-6 h-6 rounded-full" />
                )}
                <div>
                  <div className="font-medium text-sm group-hover:text-accent transition-colors">
                    {item.item?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.item?.symbol?.toUpperCase()}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

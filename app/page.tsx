import { Suspense } from 'react'
import { CryptoTable } from '@/components/ui/crypto-table'
import { MarketOverview } from '@/components/ui/market-overview'
import { TrendingSection } from '@/components/trending-section'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="app-container py-6 space-y-6">
      {/* Page header — no hero */}
      <PageHeader
        title="Cryptocurrency Prices by Market Cap"
        description="Track live cryptocurrency prices, market capitalization, 24h volume, and market performance."
      />

      {/* Market overview */}
      <Suspense fallback={<Skeleton className="h-28 rounded-lg" />} >
        <MarketOverview currency="usd" />
      </Suspense>

      {/* Trending */}
      <TrendingSection currency="usd" />

      {/* Top coins table */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Top Cryptocurrencies</h2>
        <Suspense fallback={<Skeleton className="h-[400px] rounded-lg" />} >
          <CoinsTable currency="usd" />
        </Suspense>
      </section>
    </div>
  )
}

/* ── Client-side coins table (fetches data) ── */
async function CoinsTable({ currency }: { currency: string }) {
  let coins = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/api/coins?vs_currency=${currency}&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=1h,24h,7d`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) }
    )
    const json = await res.json()
    coins = json.data || []
  } catch {}

  return <CryptoTable coins={coins} currency={currency} />
}

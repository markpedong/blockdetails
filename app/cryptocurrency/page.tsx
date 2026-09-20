import { Suspense } from 'react'
import { PageHeader } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { MarketList, type MarketParams } from '@/components/market-list'
export const dynamic = 'force-dynamic'
export default function CryptocurrencyPage({ searchParams }: { searchParams: Promise<MarketParams> }) {
  return <div className="app-container py-6 space-y-4">
    <PageHeader title="Cryptocurrencies" description="Coins and tokens ranked by market capitalization." />
    <Suspense fallback={<Skeleton className="h-[500px] rounded-lg" />}><MarketList searchParams={searchParams} /></Suspense>
  </div>
}

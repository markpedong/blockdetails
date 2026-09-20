import { Suspense } from 'react'
import { getMarkets } from '@/lib/crypto/service'
import { parseCurrencyFromUrl } from '@/lib/currency'
import { ErrorState } from '@/components/error-state'
import { CryptoTable } from '@/components/crypto-table'
import { MarketOverview } from '@/components/market-overview'
import { TrendingSection } from '@/components/trending-section'
import { PageHeader } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { CryptoPagination } from '@/components/crypto-pagination'

export const dynamic = 'force-dynamic'

const HomePage = ({ searchParams }: { searchParams: Promise<{ currency?: string; page?: string }> }) => {
  return (
    <div className="app-container py-6 space-y-5">
      <PageHeader
        title="Cryptocurrency Prices"
        description="Track live cryptocurrency prices, market capitalization, 24h volume, and market performance."
      />

      <Suspense fallback={<Skeleton className="h-20 rounded-lg" />}>
        <MarketOverviewWrapper searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-40 rounded-lg" />}>
        <TrendingWrapper searchParams={searchParams} />
      </Suspense>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Top Cryptocurrencies</h2>
        <Suspense fallback={<Skeleton className="h-[400px] rounded-lg" />}>
          <CoinsTable searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  )
}

export default HomePage

const MarketOverviewWrapper = async ({ searchParams }: { searchParams: Promise<{ currency?: string; page?: string }> }) => {
  const sp = await searchParams
  const currency = await parseCurrencyFromUrl(Promise.resolve(sp))
  return <MarketOverview currency={currency} />
}

const TrendingWrapper = async ({ searchParams }: { searchParams: Promise<{ currency?: string; page?: string }> }) => {
  const sp = await searchParams
  const currency = await parseCurrencyFromUrl(Promise.resolve(sp))
  return <TrendingSection currency={currency} />
}

const CoinsTable = async ({ searchParams }: { searchParams: Promise<{ currency?: string; page?: string }> }) => {
  const sp = await searchParams
  const currency = await parseCurrencyFromUrl(Promise.resolve(sp))
  const page = sp.page ? Math.max(1, parseInt(sp.page) || 1) : 1
  try {
    const coins = await getMarkets({ currency, perPage: 25, page })
    return (
      <div className="space-y-4">
        <CryptoTable coins={coins} currency={currency} showFilters showSupply />
        <CryptoPagination page={page} totalPages={200} />
      </div>
    )
  } catch { return <ErrorState message="Unable to load top cryptocurrencies. Please try again later." /> }
}

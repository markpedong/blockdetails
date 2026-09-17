import { Suspense } from 'react'
import { CryptoTable } from '@/components/ui/crypto-table'
import { PageHeader } from '@/components/ui/page-header'
import { CryptoPagination } from '@/components/ui/crypto-pagination'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

const CoinsPage = ({ searchParams }: { searchParams: Promise<{ page?: string; currency?: string }> }) => {
  return (
    <div className="app-container py-6 space-y-4">
      <PageHeader
        title="All Coins"
        description="Browse all cryptocurrencies ranked by market cap."
      />
      <Suspense fallback={<Skeleton className="h-[500px] rounded-lg" />}>
        <CoinsList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

const CoinsList = async ({ searchParams }: { searchParams: Promise<{ page?: string; currency?: string }> }) => {
  const sp = await searchParams
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10))
  const currency = sp.currency || 'usd'

  let coins: any[] = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/api/coins?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=${currentPage}&sparkline=false&price_change_percentage=1h,24h,7d`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) }
    )
    const json = await res.json()
    coins = json.data || []
  } catch {}

  return (
    <div className="space-y-4">
      <CryptoTable coins={coins} currency={currency} />
      <CryptoPagination page={currentPage} totalPages={200} />
    </div>
  )
}

export default CoinsPage

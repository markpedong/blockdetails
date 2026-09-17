import { Suspense } from 'react'
import { CryptoTable } from '@/components/ui/crypto-table'
import { PageHeader } from '@/components/ui/page-header'
import { CryptoPagination } from '@/components/ui/crypto-pagination'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

const CryptocurrencyPage = () => {
  return (
    <div className="app-container py-6 space-y-4">
      <PageHeader
        title="Cryptocurrencies"
        description="Track live cryptocurrency prices and market performance."
      />
      <Suspense fallback={<Skeleton className="h-[500px] rounded-lg" />}>
        <CoinsList currency="usd" />
      </Suspense>
    </div>
  )
}

export default CryptocurrencyPage

const CoinsList = async ({ currency }: { currency: string }) => {
  const url = new URL('/api/coins', process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000')
  url.searchParams.set('vs_currency', currency)
  url.searchParams.set('order', 'market_cap_desc')
  url.searchParams.set('per_page', '50')
  url.searchParams.set('sparkline', 'false')
  url.searchParams.set('price_change_percentage', '1h,24h,7d')

  let coins: any[] = []
  let totalCount = 0
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) })
    const json = await res.json()
    coins = json.data || []
    totalCount = (json as any)?.total_count || coins.length
  } catch {}

  const totalPages = Math.ceil(totalCount / 50)

  return (
    <div className="space-y-4">
      <CryptoTable coins={coins} currency={currency} />
      {totalPages > 1 && (
        <CryptoPagination page={1} totalPages={totalPages} onPageChange={() => {}} />
      )}
    </div>
  )
}

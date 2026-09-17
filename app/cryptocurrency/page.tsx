import { Suspense } from 'react'
import { CryptoTable } from '@/components/ui/crypto-table'
import { PageHeader } from '@/components/ui/page-header'
import { CryptoPagination } from '@/components/ui/crypto-pagination'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

const CryptocurrencyPage = ({ searchParams }: { searchParams: Promise<{ page?: string; currency?: string }> }) => {
  return (
    <div className="app-container py-6 space-y-4">
      <PageHeader
        title="Cryptocurrencies"
        description="Track live cryptocurrency prices and market performance."
      />
      <Suspense fallback={<Skeleton className="h-[500px] rounded-lg" />}>
        <CoinsList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default CryptocurrencyPage

const CoinsList = async ({ searchParams }: { searchParams: Promise<{ page?: string; currency?: string }> }) => {
  const sp = await searchParams
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10))
  const currency = sp.currency || 'usd'

  const url = new URL('/api/coins', process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000')
  url.searchParams.set('vs_currency', currency)
  url.searchParams.set('order', 'market_cap_desc')
  url.searchParams.set('per_page', '50')
  url.searchParams.set('page', String(currentPage))
  url.searchParams.set('sparkline', 'false')
  url.searchParams.set('price_change_percentage', '1h,24h,7d')

  let coins: any[] = []
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) })
    const json = await res.json()
    coins = json.data || []
  } catch {}

  // CoinGecko free tier has ~10k coins; paginate through them
  const totalPages = 200

  return (
    <div className="space-y-4">
      <CryptoTable coins={coins} currency={currency} />
      <CryptoPagination page={currentPage} totalPages={totalPages} />
    </div>
  )
}

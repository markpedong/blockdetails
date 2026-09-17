import { Suspense } from 'react'
import { CryptoTable } from '@/components/ui/crypto-table'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

const TokensPage = () => {
  return (
    <div className="app-container py-6 space-y-4">
      <PageHeader title="Tokens" description="Fungible tokens across various blockchains." />
      <Suspense fallback={<Skeleton className="h-[500px] rounded-lg" />}>
        <TokensList currency="usd" />
      </Suspense>
    </div>
  )
}

const TokensList = async ({ currency }: { currency: string }) => {
  let coins: any[] = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/api/coins?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d&identifier=token`,
      { next: { revalidate: 60 } }
    )
    const json = await res.json()
    coins = json.data || []
  } catch {}

  return <CryptoTable coins={coins} currency={currency} />
}

export default TokensPage

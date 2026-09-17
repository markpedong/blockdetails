import { Suspense } from 'react'
import Link from 'next/link'
import { CryptoTable } from '@/components/ui/crypto-table'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default function CoinsPage() {
  return (
    <div className="app-container py-6 space-y-4">
      <h1 className="text-xl font-bold tracking-tight">All Coins</h1>
      <Suspense fallback={<Skeleton className="h-[500px] rounded-lg" />}>
        <CoinsList currency="usd" />
      </Suspense>
    </div>
  )
}

async function CoinsList({ currency }: { currency: string }) {
  let coins: any[] = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/api/coins?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d`,
      { next: { revalidate: 60 } }
    )
    const json = await res.json()
    coins = json.data || []
  } catch {}

  return <CryptoTable coins={coins} currency={currency} />
}

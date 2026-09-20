import { getMarkets } from '@/lib/crypto/service'
import { parseCurrencyFromUrl } from '@/lib/currency'
import { CryptoTable } from '@/components/crypto-table'
import { ErrorState } from '@/components/error-state'
import { CryptoPagination } from '@/components/crypto-pagination'

export type MarketParams = { page?: string; currency?: string; category?: string }
export async function MarketList({ searchParams }: { searchParams: Promise<MarketParams> }) {
  const sp = await searchParams
  const currency = await parseCurrencyFromUrl(Promise.resolve(sp))
  const page = /^\d+$/.test(sp.page || '') ? Math.min(200, Math.max(1, Number(sp.page))) : 1
  try {
    const coins = await getMarkets({ currency, page, perPage: 50, category: sp.category })
    return <div className="space-y-4">
      <CryptoTable coins={coins} currency={currency} showFilters showSupply />
      <CryptoPagination page={page} totalPages={200} />
    </div>
  } catch { return <ErrorState message="Unable to load cryptocurrency prices. Please try again later." /> }
}

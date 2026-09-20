import { getMarkets } from '@/lib/crypto/service'
import { parseCurrencyFromUrl } from '@/lib/currency'
import { PageHeader } from '@/components/page-header'
import { CryptoTable } from '@/components/crypto-table'
import { ErrorState } from '@/components/error-state'
export const dynamic = 'force-dynamic'
export default async function MoversPage({ searchParams }: { searchParams: Promise<{ currency?: string }> }) {
  const currency = await parseCurrencyFromUrl(searchParams)
  let coins
  try { coins = await getMarkets({ currency, perPage: 250, page: 1 }) }
  catch { return <div className="app-container py-6"><ErrorState message="Unable to load market movers." /></div> }
  const ranked = coins.filter(c => c.price_change_percentage_24h !== null).sort((a, b) => b.price_change_percentage_24h! - a.price_change_percentage_24h!)
  return <div className="app-container py-6 space-y-5"><PageHeader title="Gainers & Losers" description={`24-hour movers within the top ${coins.length} assets returned by market capitalization (up to 250), in ${currency.toUpperCase()}. Not the entire market.`} />
    <section className="space-y-3"><h2 className="text-lg font-semibold">Top Gainers</h2><CryptoTable coins={ranked.filter(c => c.price_change_percentage_24h! > 0).slice(0, 20)} currency={currency} /></section>
    <section className="space-y-3"><h2 className="text-lg font-semibold">Top Losers</h2><CryptoTable coins={ranked.filter(c => c.price_change_percentage_24h! < 0).reverse().slice(0, 20)} currency={currency} /></section>
  </div>
}

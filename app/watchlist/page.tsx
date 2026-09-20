import { PageHeader } from '@/components/page-header'
import { WatchlistContent } from '@/components/watchlist-content'
import { parseCurrencyFromUrl } from '@/lib/currency'
export default async function WatchlistPage({ searchParams }: { searchParams: Promise<{ currency?: string }> }) {
  const currency = await parseCurrencyFromUrl(searchParams)
  return <div className="app-container py-6 space-y-4"><PageHeader title="Watchlist" description="Your saved assets, stored locally in this browser. No account or cloud sync." /><WatchlistContent currency={currency} /></div>
}

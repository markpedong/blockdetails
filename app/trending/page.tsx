import { PageHeader } from '@/components/page-header'
import { TrendingSection } from '@/components/trending-section'
import { parseCurrencyFromUrl } from '@/lib/currency'
export const dynamic = 'force-dynamic'
export default async function TrendingPage({ searchParams }: { searchParams: Promise<{ currency?: string }> }) {
  const currency = await parseCurrencyFromUrl(searchParams)
  return <div className="app-container py-6 space-y-4"><PageHeader title="Trending Cryptocurrencies" description="Assets trending in provider search activity, not a ranking of price performance." /><TrendingSection currency={currency} full /></div>
}

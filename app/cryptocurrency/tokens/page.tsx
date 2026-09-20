import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { parseCurrencyFromUrl } from '@/lib/currency'
export default async function TokensPage({ searchParams }: { searchParams: Promise<{ currency?: string }> }) {
  const currency = await parseCurrencyFromUrl(searchParams)
  return <div className="app-container py-6 space-y-4">
    <PageHeader title="Tokens" description="The market feed does not provide a reliable coin-versus-token classification. We do not infer asset types from ticker symbols." />
    <p className="text-sm text-muted-foreground">Browse provider-defined categories instead, or check an asset’s contract addresses on its detail page.</p>
    <Link className="text-sm underline" href={`/categories?currency=${currency}`}>Browse categories →</Link>
  </div>
}

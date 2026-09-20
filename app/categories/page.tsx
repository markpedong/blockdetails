import Link from 'next/link'
import { getCategories } from '@/lib/crypto/service'
import { parseCurrencyFromUrl } from '@/lib/currency'
import { PageHeader } from '@/components/page-header'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'
export const dynamic = 'force-dynamic'
export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ currency?: string }> }) {
  const currency = await parseCurrencyFromUrl(searchParams)
  let categories
  try { categories = await getCategories() }
  catch { return <div className="app-container py-6"><PageHeader title="Categories" /><ErrorState message="Categories are unavailable from the selected data provider. Please try again later." /></div> }
  return <div className="app-container py-6 space-y-4"><PageHeader title="Categories" description="Explore provider-defined sectors and ecosystems." />
    {categories.length === 0 ? <EmptyState message="No categories reported." /> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">{categories.map(category => <Link key={category.id} className="rounded-lg border p-3 text-sm hover:bg-muted/30" href={`/categories/${encodeURIComponent(category.id)}?currency=${currency}`}>{category.name}</Link>)}</div>}
  </div>
}

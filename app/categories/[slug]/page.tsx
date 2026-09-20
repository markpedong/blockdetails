import { notFound } from 'next/navigation'
import { getCategories } from '@/lib/crypto/service'
import { MarketList } from '@/components/market-list'
import { PageHeader } from '@/components/page-header'
import { ErrorState } from '@/components/error-state'
export const dynamic = 'force-dynamic'
export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ currency?: string; page?: string }> }) {
  const { slug } = await params
  let categories
  try { categories = await getCategories() }
  catch { return <div className="app-container py-6"><ErrorState message="Category data is unavailable from the selected provider." /></div> }
  const category = categories.find(item => item.id === slug)
  if (!category) notFound()
  return <div className="app-container py-6 space-y-4"><PageHeader title={category.name} description="Assets in this provider-defined category, ranked by market capitalization." /><MarketList searchParams={Promise.resolve({ ...await searchParams, category: slug })} /></div>
}

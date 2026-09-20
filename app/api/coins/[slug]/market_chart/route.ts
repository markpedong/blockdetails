import { getChart } from '@/lib/crypto/service'
import { respond } from '@/lib/crypto/http'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  return respond(() => getChart(slug, searchParams.get('vs_currency') || 'usd', Number(searchParams.get('days') ?? 7)))
}

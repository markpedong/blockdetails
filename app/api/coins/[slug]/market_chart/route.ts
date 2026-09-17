import { NextRequest, NextResponse } from 'next/server'
import { getMarketChart } from '@/lib/crypto/service'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug || slug.length < 1) {
    return NextResponse.json({ error: { code: 'INVALID_SLUG', message: 'Coin slug is required' } }, { status: 400 })
  }

  const url = new URL(req.url)
  const currency = (url.searchParams.get('currency') ?? 'usd').toLowerCase()
  const days = Math.min(Math.max(1, parseInt(url.searchParams.get('days') ?? '1', 10)), 365)

  try {
    const chart = await getMarketChart(slug, currency, days)
    return NextResponse.json({ data: chart })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch market chart' } }, { status: 502 })
  }
}

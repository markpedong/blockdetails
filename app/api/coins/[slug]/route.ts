import { NextRequest, NextResponse } from 'next/server'
import { getCoinDetail, getMarketChart } from '@/lib/crypto'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const url = new URL(req.url)
  const currency = (url.searchParams.get('currency') ?? 'usd').toLowerCase()

  if (!slug || slug.length < 1) {
    return NextResponse.json({ error: { code: 'INVALID_SLUG', message: 'Coin slug is required' } }, { status: 400 })
  }

  try {
    const [coin, chart] = await Promise.all([
      getCoinDetail(slug, currency),
      getMarketChart(slug, currency, parseInt(url.searchParams.get('days') ?? '1', 10)),
    ])

    if (!coin) {
      return NextResponse.json({ error: { code: 'COIN_NOT_FOUND', message: `Coin '${slug}' not found` } }, { status: 404 })
    }

    // Explicitly no-store for live price data; chart is already no-store in provider
    return NextResponse.json({ data: { coin, chart } }, { headers: { 'Cache-Control': 'no-store, no-cache' } })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch coin data' } }, { status: 502 })
  }
}

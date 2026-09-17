import { NextRequest, NextResponse } from 'next/server'
import { getExchangeDetail, getExchangeMarkets } from '@/lib/crypto/service'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug || slug.length < 1) {
    return NextResponse.json({ error: { code: 'INVALID_SLUG', message: 'Exchange slug is required' } }, { status: 400 })
  }

  const url = new URL(req.url)
  const includeMarkets = url.searchParams.get('markets') === 'true'

  try {
    const exchange = await getExchangeDetail(slug)
    if (!exchange) {
      return NextResponse.json({ error: { code: 'EXCHANGE_NOT_FOUND', message: `Exchange '${slug}' not found` } }, { status: 404 })
    }

    if (includeMarkets) {
      const markets = await getExchangeMarkets(slug)
      return NextResponse.json({ data: { exchange, markets } })
    }

    return NextResponse.json({ data: { exchange } })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch exchange data' } }, { status: 502 })
  }
}

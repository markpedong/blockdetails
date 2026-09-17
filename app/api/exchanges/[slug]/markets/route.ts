import { NextRequest, NextResponse } from 'next/server'
import { getExchangeMarkets } from '@/lib/crypto/service'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug || slug.length < 1) {
    return NextResponse.json({ error: { code: 'INVALID_SLUG', message: 'Exchange slug is required' } }, { status: 400 })
  }

  const url = new URL(req.url)
  const perPage = Math.min(Math.max(1, parseInt(url.searchParams.get('per_page') ?? '50', 10)), 250)

  try {
    const markets = await getExchangeMarkets(slug, perPage)
    return NextResponse.json({ data: markets })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch exchange markets' } }, { status: 502 })
  }
}

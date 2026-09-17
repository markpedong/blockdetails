import { NextRequest, NextResponse } from 'next/server'
import { searchCoins } from '@/lib/crypto'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const query = url.searchParams.get('q') ?? ''
  const currency = (url.searchParams.get('currency') ?? 'usd').toLowerCase()

  if (!query || query.length < 1) {
    return NextResponse.json({ error: { code: 'INVALID_QUERY', message: 'Search query is required' } }, { status: 400 })
  }

  try {
    const results = await searchCoins(query, currency)
    return NextResponse.json({ data: results })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to search coins' } }, { status: 502 })
  }
}

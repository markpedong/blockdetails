import { NextRequest, NextResponse } from 'next/server'
import { getExchangesPaginated, getExchangeDetail, getExchangeMarkets } from '@/lib/crypto/service'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const perPage = Math.min(Math.max(1, parseInt(url.searchParams.get('per_page') ?? '50', 10)), 250)
  const page = Math.min(Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10)), 100)

  try {
    const result = await getExchangesPaginated(perPage, page)
    return NextResponse.json({ data: result.data })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch exchanges' } }, { status: 502 })
  }
}

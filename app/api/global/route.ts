import { NextRequest, NextResponse } from 'next/server'
import { getGlobalData } from '@/lib/crypto'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const currency = (url.searchParams.get('currency') ?? 'usd').toLowerCase()

  try {
    const data = await getGlobalData(currency)
    if (!data) {
      return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch global data' } }, { status: 503 })
    }
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch global data' } }, { status: 503 })
  }
}

import { NextResponse } from 'next/server'
import { getCoinsList } from '@/lib/crypto'

export async function GET() {
  try {
    const list = await getCoinsList()
    return NextResponse.json({ data: list })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch coin list' } }, { status: 502 })
  }
}

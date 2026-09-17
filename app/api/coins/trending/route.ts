import { NextRequest, NextResponse } from 'next/server'
import { getTrending } from '@/lib/crypto'

export async function GET() {
  try {
    const trending = await getTrending()
    return NextResponse.json({ data: trending })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch trending coins' } }, { status: 502 })
  }
}

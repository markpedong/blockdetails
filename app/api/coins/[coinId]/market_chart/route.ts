import { NextRequest, NextResponse } from 'next/server'

const CG = process.env.NEXT_PUBLIC_COINGECKO || 'https://api.coingecko.com/api/v3'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ coinId: string }> }
) {
  const { coinId } = await params
  const { searchParams } = new URL(req.url)
  const vsCurrency = searchParams.get('vs_currency') || 'usd'
  const days = searchParams.get('days') || '1'

  const res = await fetch(`${CG}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`)
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch chart' }, { status: res.status })

  const data = await res.json()
  return NextResponse.json(data)
}

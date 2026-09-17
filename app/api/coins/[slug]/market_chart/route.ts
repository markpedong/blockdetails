import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const vs_currency = searchParams.get('vs_currency') || 'usd'
  const days = searchParams.get('days') || '7'

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${slug}/market_chart?vs_currency=${vs_currency}&days=${days}`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Market chart API error:', err)
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}

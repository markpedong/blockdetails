import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vs_currency = searchParams.get('vs_currency') || 'usd'
  const order = searchParams.get('order') || 'market_cap_desc'
  const perPage = parseInt(searchParams.get('per_page') || '25', 10)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const sparkline = searchParams.get('sparkline') === 'true'
  const priceChangePercentage = searchParams.get('price_change_percentage') || ''

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&order=${order}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePercentage}`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch coins' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ data })
  } catch (err) {
    console.error('Coins API error:', err)
    return NextResponse.json({ error: 'Failed to fetch coins' }, { status: 500 })
  }
}

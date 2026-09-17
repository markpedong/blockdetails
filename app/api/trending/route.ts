import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vs_currency = searchParams.get('vs_currency') || 'usd'

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search/trending?vs_currency=${vs_currency}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(15_000) }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch trending' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Trending API error:', err)
    return NextResponse.json({ error: 'Failed to fetch trending' }, { status: 500 })
  }
}

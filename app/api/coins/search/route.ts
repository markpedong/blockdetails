import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  if (q.length < 2) {
    return NextResponse.json({ data: [] })
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search/coins?query=${encodeURIComponent(q)}`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
    }

    const data = await res.json()
    // Map search results to coin format for the command menu
    const coins = (data.coins || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      market_cap_rank: c.market_cap_rank,
      image: c.large,
    }))

    return NextResponse.json({ data: coins })
  } catch (err) {
    console.error('Search API error:', err)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
}

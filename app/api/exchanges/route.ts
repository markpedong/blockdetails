import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const order = searchParams.get('order') || 'volume_desc'
  const perPage = parseInt(searchParams.get('per_page') || '50', 10)

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/exchanges?order=${order}&per_page=${perPage}`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch exchanges' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ data })
  } catch (err) {
    console.error('Exchanges API error:', err)
    return NextResponse.json({ error: 'Failed to fetch exchanges' }, { status: 500 })
  }
}

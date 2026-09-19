import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string> }>
) {
  const { slug } = await params

  if (!slug || slug.length < 1) {
    return NextResponse.json({ error: { code: 'INVALID_SLUG', message: 'Exchange slug is required' } }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const perPage = Math.min(Math.max(1, parseInt(searchParams.get('per_page') ?? '50', 10)), 250)

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/exchanges/${slug}/tickers?per_page=${perPage}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(15_000) }
    )

    if (!res.ok) {
      return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch exchange markets' } }, { status: 502 })
    }

    const data = await res.json()
    const markets = (data.tickers ?? []).map((t: any) => ({
      base: t.base ?? '',
      quote: t.target ?? '',
      last_price: t.last ?? null,
      volume_24h_usd: t.converted_volume?.usd ?? null,
      trust_score: t.trust_score ?? null,
    }))

    return NextResponse.json({ data: markets })
  } catch (err) {
    console.error('Exchange markets API error:', err)
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch exchange markets' } }, { status: 502 })
  }
}

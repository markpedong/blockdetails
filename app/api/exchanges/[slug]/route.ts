import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/exchanges/${slug}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(15_000) }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch exchange' }, { status: 500 })
    }

    const data = await res.json()

    // Map tickers to pairs format expected by the UI
    const pairs = (data.tickers ?? []).slice(0, 100).map((t: any) => ({
      market_id: t.market?.identifier ?? '',
      base_symbol: t.base ?? '',
      quote_symbol: t.target ?? '',
      volume_btc_24h: t.converted_volume?.btc ?? null,
    }))

    return NextResponse.json({ data: { exchange: data, pairs } })
  } catch (err) {
    console.error('Exchange detail API error:', err)
    return NextResponse.json({ error: 'Failed to fetch exchange' }, { status: 500 })
  }
}

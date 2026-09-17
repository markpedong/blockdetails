import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const vs_currency = searchParams.get('vs_currency') || 'usd'

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${slug}?vs_currency=${vs_currency}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch coin' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ data })
  } catch (err) {
    console.error('Coin detail API error:', err)
    return NextResponse.json({ error: 'Failed to fetch coin' }, { status: 500 })
  }
}

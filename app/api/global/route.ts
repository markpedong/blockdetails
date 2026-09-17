import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const currency = searchParams.get('vs_currency') || 'usd'

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/global`,
      { next: { revalidate: 60 } }
    )
    const json = await res.json()

    return NextResponse.json({ data: json.data })
  } catch (err) {
    console.error('Global API error:', err)
    return NextResponse.json({ error: 'Failed to fetch global data' }, { status: 500 })
  }
}

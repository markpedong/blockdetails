import { NextRequest, NextResponse } from 'next/server'
import { getCoinsPaginated } from '@/lib/crypto/service'
import { parseCurrencyFromUrl as parseCur } from '@/lib/currency'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const currency = (url.searchParams.get('currency') ?? 'usd').toLowerCase()
  if (!['usd', 'eur', 'gbp', 'jpy', 'aud', 'php'].includes(currency)) {
    return NextResponse.json({ error: { code: 'INVALID_CURRENCY', message: `Unsupported currency: ${currency}` } }, { status: 400 })
  }

  const order = url.searchParams.get('order') ?? 'market_cap_desc'
  const validOrders = ['market_cap_desc', 'price_desc', 'volume_desc', 'price_change_24h_desc']
  if (!validOrders.includes(order)) {
    return NextResponse.json({ error: { code: 'INVALID_ORDER', message: `Unsupported order: ${order}` } }, { status: 400 })
  }

  const perPage = Math.min(Math.max(1, parseInt(url.searchParams.get('per_page') ?? '50', 10)), 250)
  const page = Math.min(Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10)), 1000)

  try {
    const result = await getCoinsPaginated(currency, order, perPage, page)
    return NextResponse.json({ data: result.data })
  } catch {
    return NextResponse.json({ error: { code: 'FETCH_ERROR', message: 'Failed to fetch coins' } }, { status: 502 })
  }
}

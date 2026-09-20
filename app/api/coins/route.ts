import { getMarkets } from '@/lib/crypto/service'
import { respond } from '@/lib/crypto/http'

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams
  const ids = sp.has('ids') ? (sp.get('ids') || '').split(',').filter(Boolean) : undefined
  return respond(() => getMarkets({ currency: sp.get('vs_currency') || 'usd', page: Number(sp.get('page') ?? 1), perPage: Number(sp.get('per_page') ?? (ids ? Math.max(ids.length, 1) : 50)), order: sp.get('order') || 'market_cap_desc', ids, category: sp.get('category') || undefined }))
}

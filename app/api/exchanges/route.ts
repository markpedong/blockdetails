import { getExchanges } from '@/lib/crypto/service'
import { respond } from '@/lib/crypto/http'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return respond(() => getExchanges(Number(searchParams.get('page') ?? 1), Number(searchParams.get('per_page') ?? 50)))
}

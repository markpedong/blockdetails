import { getTrending } from '@/lib/crypto/service'
import { respond } from '@/lib/crypto/http'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return respond(() => getTrending(searchParams.get('vs_currency') || 'usd'))
}

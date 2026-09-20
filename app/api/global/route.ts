import { getGlobal } from '@/lib/crypto/service'
import { respond } from '@/lib/crypto/http'

export async function GET(request: Request) {
  return respond(() => getGlobal(new URL(request.url).searchParams.get('vs_currency') || 'usd'))
}

import { searchCoins } from '@/lib/crypto/service'
import { respond } from '@/lib/crypto/http'

export async function GET(request: Request) {
  return respond(() => searchCoins(new URL(request.url).searchParams.get('q') || ''))
}

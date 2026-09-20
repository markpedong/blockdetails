import { getExchange } from '@/lib/crypto/service'
import { respond } from '@/lib/crypto/http'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return respond(() => getExchange(slug))
}

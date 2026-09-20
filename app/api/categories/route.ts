import { getCategories } from '@/lib/crypto/service'
import { respond } from '@/lib/crypto/http'
export async function GET() { return respond(() => getCategories()) }

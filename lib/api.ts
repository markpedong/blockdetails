const CG = process.env.NEXT_PUBLIC_COINGECKO || 'https://api.coingecko.com/api/v3'
const CMC = process.env.NEXT_PUBLIC_COINMARKETCAP

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Map CoinGecko paths → CMC equivalents (free tier)
const CG_TO_CMC: Record<string, string | null> = {
  '/coins/markets': '/v1/cryptocurrency/listings/latest',
  '/global': null, // no CMC equivalent for global data
  '/search/trending': null,
}

async function fetchCMC(path: string): Promise<unknown> {
  if (!CMC) return null
  const mapped = CG_TO_CMC[path]
  if (!mapped) return null

  const url = `https://pro-api.coinmarketcap.com/v1${mapped}`
  const res = await fetch(url, {
    headers: { 'X-CMC_PRO_API_KEY': CMC },
    signal: AbortSignal.timeout(5_000),
  })

  if (!res.ok) return null
  const data = await res.json()
  // CMC wraps data in { data: [...] }, normalize to array for /coins/markets
  if (mapped === '/v1/cryptocurrency/listings/latest' && data.data) {
    return data.data as unknown
  }
  return data
}

export async function fetchCG(
  path: string,
  options?: { cache?: 'force-cache' | 'no-store'; revalidate?: number },
): Promise<unknown> {
  const url = `${CG}${path.startsWith('/') ? path : `/${path}`}`

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: options?.cache ?? 'force-cache',
    next: { revalidate: options?.revalidate ?? 60 },
    signal: AbortSignal.timeout(5_000),
  })

  if (!res.ok) {
    const body = await res.text()
    // On 429, try CMC as fallback before returning defaults
    if (res.status === 429 && CMC) {
      const fallback = await fetchCMC(path)
      if (fallback !== null) return fallback
    }
    // Return empty defaults for rate-limited requests so pages render gracefully
    if (path.includes('/coins/markets')) return [] as unknown
    if (path === '/global') return { total_market_cap: {}, total_volume: {}, btc_dominance: 0 } as unknown
    if (path.includes('/coins/')) return { market_data: {}, description: { en: '' }, links: { repos_url: {} } } as unknown
    if (path.includes('/search/trending')) return [] as unknown
    if (path.includes('/exchanges')) return [] as unknown
    // Default: empty object
    return {} as unknown
  }

  return res.json()
}

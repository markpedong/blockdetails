const CG = process.env.NEXT_PUBLIC_COINGECKO || 'https://api.coingecko.com/api/v3'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
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
  })

  if (!res.ok) {
    const body = await res.text()
    // Distinguish rate limiting from other errors
    if (res.status === 429) {
      throw new ApiError(429, 'Rate limit exceeded. Please try again in a moment.')
    }
    if (res.status === 404) {
      throw new ApiError(404, 'Resource not found.')
    }
    throw new ApiError(res.status, `CoinGecko API error ${res.status}: ${body.slice(0, 200)}`)
  }

  return res.json()
}

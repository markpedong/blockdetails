const CG = process.env.NEXT_PUBLIC_COINGECKO || 'https://api.coingecko.com/api/v3'

export async function fetchCG(path: string, options?: { cache?: 'force-cache' | 'no-store'; revalidate?: number }) {
  const url = `${CG}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: options?.cache ?? 'force-cache',
    next: { revalidate: options?.revalidate ?? 60 }
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`CoinGecko API error ${res.status}: ${body.slice(0, 200)}`)
  }

  return res.json()
}

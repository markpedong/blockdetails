const KEY = 'blockdetails_watchlist'

export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function toggleWatchlist(coinId: string): string[] {
  const list = getWatchlist()
  const next = list.includes(coinId) ? list.filter(id => id !== coinId) : [...list, coinId]
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function isWatchlisted(coinId: string): boolean {
  return getWatchlist().includes(coinId)
}

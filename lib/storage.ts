const KEY = 'blockdetails_watchlist'
const EVENT = 'blockdetails:watchlist'
const validId = (id: unknown): id is string => typeof id === 'string' && /^[a-z0-9][a-z0-9_-]{0,199}$/.test(id)

export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  const value: unknown = JSON.parse(raw)
  if (!Array.isArray(value) || !value.every(validId)) throw new Error('Saved watchlist is invalid. Your saved data has not been changed.')
  return [...new Set(value)]
}

export function toggleWatchlist(coinId: string): string[] {
  if (!validId(coinId)) throw new Error('Invalid asset ID.')
  const list = getWatchlist()
  const next = list.includes(coinId) ? list.filter(id => id !== coinId) : [...list, coinId]
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(EVENT))
  return next
}

export function subscribeWatchlist(callback: () => void): () => void {
  const onStorage = (event: StorageEvent) => { if (event.key === KEY || event.key === null) callback() }
  window.addEventListener('storage', onStorage)
  window.addEventListener(EVENT, callback)
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(EVENT, callback) }
}

export function isWatchlisted(coinId: string): boolean { return getWatchlist().includes(coinId) }

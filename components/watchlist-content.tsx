 'use client'
import { useEffect, useState } from 'react'
import { getWatchlist, subscribeWatchlist } from '@/lib/storage'
import { CryptoTable, type Coin } from '@/components/crypto-table'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'

export function WatchlistContent({ currency }: { currency: string }) {
  const [ids, setIds] = useState<string[] | null>(null)
  const [storageError, setStorageError] = useState('')
  const [error, setError] = useState('')
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    const update = () => {
      try { setIds(getWatchlist()); setStorageError('') }
      catch { setStorageError('Cannot read your saved watchlist. Saved data has not been overwritten.'); setLoading(false) }
    }
    update()
    return subscribeWatchlist(update)
  }, [retry])
  useEffect(() => {
    if (!ids) return
    const controller = new AbortController()
    setError(''); setCoins([])
    if (!ids.length) { setLoading(false); return }
    setLoading(true)
    const load = async () => {
      const collected: Coin[] = []
      // Request only saved IDs; batching keeps URLs and provider limits bounded.
      for (let i = 0; i < ids.length; i += 100) {
        const params = new URLSearchParams({ ids: ids.slice(i, i + 100).join(','), vs_currency: currency, per_page: '100' })
        const res = await fetch(`/api/coins?${params}`, { signal: controller.signal })
        if (!res.ok) throw new Error('Watchlist prices unavailable')
        const json = await res.json()
        if (!Array.isArray(json.data)) throw new Error('Invalid response')
        collected.push(...json.data)
      }
      if (!controller.signal.aborted) setCoins(collected.filter(coin => ids.includes(coin.id)))
    }
    load().catch(() => { if (!controller.signal.aborted) setError('Unable to load watchlist prices. Your saved assets are unchanged.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [ids, currency, retry])
  if (storageError) return <ErrorState message={storageError} onRetry={() => setRetry(v => v + 1)} />
  if (loading) return <p role="status" className="text-sm text-muted-foreground">Loading watchlist…</p>
  if (error) return <ErrorState message={error} onRetry={() => setRetry(v => v + 1)} />
  if (!ids?.length) return <EmptyState message="Your watchlist is empty. Use the star next to an asset to save it on this browser." />
  const missing = ids.filter(id => !coins.some(coin => coin.id === id))
  return <div className="space-y-3"><CryptoTable coins={coins} currency={currency} />{missing.length > 0 && <p role="status" className="text-sm text-muted-foreground">No quote was returned for: {missing.join(', ')}. These assets remain saved.</p>}</div>
}

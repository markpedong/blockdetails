'use client'

import { useEffect, useState, useCallback } from 'react'

type QuotesState = {
  quotes: Record<string, number>
  loading: boolean
  error: string
  lastUpdated: string
}

export function useQuotes(assetIds: string[], refreshKey = 0): QuotesState & { refresh: () => void } {
  const [quotes, setQuotes] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [refresh, setRefresh] = useState(0)

  const key = assetIds.filter(Boolean).join(',')

  useEffect(() => {
    if (!key) { setQuotes({}); setLoading(false); setError(''); return }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    const ids = key.split(',')
    const chunks: string[][] = []
    for (let i = 0; i < ids.length; i += 100) chunks.push(ids.slice(i, i + 100))
    Promise.all(chunks.map(async batch => {
      const params = new URLSearchParams({ ids: batch.join(','), vs_currency: 'usd' })
      const res = await fetch(`/api/coins?${params}`, { signal: controller.signal, cache: 'no-store' })
      if (!res.ok) throw new Error('Price fetch failed')
      const body: unknown = await res.json()
      if (!body || typeof body !== 'object' || !('data' in body) || !Array.isArray((body as Record<string, unknown>).data)) {
        throw new Error('Invalid price response')
      }
      return (body as { data: Array<Record<string, unknown>> }).data
    })).then(batches => {
      if (controller.signal.aborted) return
      const next: Record<string, number> = {}
      for (const coin of batches.flat()) {
        if (coin && typeof coin.id === 'string' && typeof coin.current_price === 'number') {
          next[coin.id] = coin.current_price
        }
      }
      setQuotes(next)
      setLastUpdated(new Date().toLocaleTimeString())
    }).catch(e => {
      if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Price fetch failed')
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [key, refreshKey, refresh])

  const doRefresh = useCallback(() => setRefresh(n => n + 1), [])

  return { quotes, loading, error, lastUpdated, refresh: doRefresh }
}

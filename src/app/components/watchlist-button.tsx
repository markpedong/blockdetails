'use client'

import { getWatchlist, toggleWatchlist } from '@/lib/storage'
import { useState, useCallback } from 'react'

export function WatchlistButton({ coinId }: { coinId: string }) {
  const [watchlisted, setWatchlisted] = useState(() => getWatchlist().includes(coinId))

  const toggle = useCallback(() => {
    setWatchlisted(prev => {
      toggleWatchlist(coinId)
      return !prev
    })
  }, [coinId])

  return (
    <button
      onClick={toggle}
      className={`text-lg transition hover:scale-110 ${watchlisted ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
      title={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {watchlisted ? '★' : '☆'}
    </button>
  )
}

 'use client'

import { useEffect, useState } from 'react'
import { StarIcon } from 'lucide-react'
import { getWatchlist, toggleWatchlist, subscribeWatchlist } from '@/lib/storage'

export function WatchlistButton({ coinId }: { coinId: string }) {
  const [watched, setWatched] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const update = () => {
      try { setWatched(getWatchlist().includes(coinId)); setError('') }
      catch { setError('Cannot read saved watchlist. Existing data was not changed.') }
      setReady(true)
    }
    update()
    return subscribeWatchlist(update)
  }, [coinId])
  return <div>
    <button type="button" disabled={!ready} aria-pressed={watched}
      aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
      onClick={() => {
        try { setWatched(toggleWatchlist(coinId).includes(coinId)); setError('') }
        catch { setError('Could not save watchlist. Existing data was not changed.') }
      }}>
      <StarIcon className={`w-3.5 h-3.5 ${watched ? 'fill-yellow-400 text-yellow-400' : ''}`} />
    </button>
    {error && <p role="alert" className="text-xs text-destructive max-w-48">{error}</p>}
  </div>
}

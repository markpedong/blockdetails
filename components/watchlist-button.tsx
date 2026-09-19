'use client'

import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { StarIcon } from 'lucide-react'
import { getWatchlist, toggleWatchlist } from '@/lib/storage'

export function WatchlistButton({ coinId }: { coinId: string }) {
  const [watched, setWatched] = useState(() => getWatchlist().includes(coinId))

  const toggle = () => {
    const next = toggleWatchlist(coinId)
    setWatched(next.includes(coinId))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted" aria-label="Watchlist">
        <StarIcon className={`w-3.5 h-3.5 ${watched ? 'fill-yellow-400 text-yellow-400' : ''}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={toggle}>
          {watched ? '★ Remove from Watchlist' : '☆ Add to Watchlist'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

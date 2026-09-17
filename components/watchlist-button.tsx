'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { StarIcon } from 'lucide-react'

export function WatchlistButton({ coinId }: { coinId: string }) {
  const [watched, setWatched] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('watchlist') || '[]') as string[]
      return list.includes(coinId)
    } catch { return false }
  })

  const toggle = () => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem('watchlist') || '[]')
      const idx = list.indexOf(coinId)
      if (idx >= 0) {
        list.splice(idx, 1)
      } else {
        list.push(coinId)
      }
      localStorage.setItem('watchlist', JSON.stringify(list))
      setWatched(!watched)
    } catch {}
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Watchlist" {...props}>
            <StarIcon className={`w-3.5 h-3.5 ${watched ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
        )}
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={toggle}>
          {watched ? '★ Remove from Watchlist' : '☆ Add to Watchlist'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { parseCurrencyFromUrl } from '@/lib/currency'
import { ErrorState } from '@/components/error-state'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { SearchIcon } from 'lucide-react'

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ id: string; name: string; symbol: string; image: string | null; market_cap_rank: number | null }[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setResults([])
    setError('')
    if (!open || query.trim().length < 2) { setLoading(false); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/coins/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal })
        if (!res.ok) throw new Error('Search unavailable')
        const json = await res.json()
        if (!Array.isArray(json.data)) throw new Error('Invalid search response')
        if (!controller.signal.aborted) setResults(json.data)
      } catch { if (!controller.signal.aborted) setError('Search is temporarily unavailable. Please try again.') }
      finally { if (!controller.signal.aborted) setLoading(false) }
    }, 200)
    return () => { clearTimeout(timer); controller.abort() }
  }, [query, open])

  const handleSelect = async (id: string) => {
    const currency = await parseCurrencyFromUrl(Promise.resolve({ currency: new URLSearchParams(window.location.search).get('currency') || undefined }))
    router.push(`/cryptocurrency/${encodeURIComponent(id)}?currency=${currency}`)
    setOpen(false)
    setQuery('')
    setResults([])
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); setQuery('') }}
        className="flex items-center gap-1.5 text-xs bg-muted/50 border border-border rounded-md px-2.5 py-1.5 hover:bg-muted/70 transition-colors"
        aria-label="Search assets"
      >
        <SearchIcon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground hidden sm:inline">Search assets...</span>
        <kbd className="font-mono text-[10px] bg-muted/80 px-1 rounded ml-1 hidden sm:inline">⌘K</kbd>
      </button>

      <Dialog open={open} onOpenChange={(o) => { if (!o) { setOpen(false); setQuery(''); setResults([]) } }}>
        <DialogContent className="sm:max-w-lg p-0 gap-0">
          <DialogTitle className="sr-only">Search assets</DialogTitle>
          <Command shouldFilter={false} className="rounded-lg border shadow-sm">
            <CommandInput
              placeholder="Search cryptocurrencies..."
              value={query}
              onValueChange={setQuery}
              autoFocus
            />
            <CommandList>
              {loading ? (
                <CommandEmpty className="px-4 py-6 text-sm text-muted-foreground">Searching...</CommandEmpty>
              ) : error ? <ErrorState compact message={error} /> : query.trim().length < 2 ? <CommandEmpty>Type at least two characters.</CommandEmpty> : results.length === 0 ? (
                <CommandEmpty className="px-4 py-6 text-sm text-muted-foreground">No results for &quot;{query}&quot;</CommandEmpty>
              ) : (
                <CommandGroup heading="Assets">
                  {results.map((coin) => (
                    <CommandItem
                      key={coin.id}
                      value={coin.name}
                      onSelect={() => handleSelect(coin.id)}
                    >
                      {coin.image && (
                        <Image src={coin.image} alt="" width={16} height={16} unoptimized className="w-4 h-4 rounded-full mr-2" />
                      )}
                      <span className="font-medium text-foreground">{coin.name}</span>
                      <span className="text-muted-foreground text-xs ml-auto">/{coin.symbol?.toUpperCase()}</span>
                      {coin.market_cap_rank && (
                        <span className="text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-full ml-2">#{coin.market_cap_rank}</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}

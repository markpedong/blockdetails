'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
      if (!open) return
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)); return }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); return }
      if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        router.push(`/cryptocurrency/${results[selectedIndex].id}`)
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, results, selectedIndex, router])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        if (query.length < 2) { setResults([]); setLoading(false); return }
        const res = await fetch(`/api/coins/search?query=${encodeURIComponent(query)}`)
        const json = await res.json()
        setResults(json.data || [])
      } catch { setResults([]) }
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-1.5 text-xs bg-muted/10 border border-border rounded-md px-2.5 py-1 hover:bg-muted/20 transition-colors"
        aria-label="Search coins"
      >
        <span className="text-muted">Search</span>
        <kbd className="font-mono text-[10px] bg-muted/20 px-1 rounded">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(-1) }}
            placeholder="Search coins, tokens..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-xs text-muted hover:text-foreground transition-colors">Esc</button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-muted">Searching...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted">No results for "{query}"</div>
          ) : (
            <ul className="py-2">
              {results.map((coin, i) => (
                <li key={coin.id}>
                  <Link
                    href={`/cryptocurrency/${coin.id}`}
                    className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${i === selectedIndex ? 'bg-muted/10' : ''}`}
                    onClick={() => { setOpen(false) }}
                  >
                    {coin.thumb && <img src={coin.thumb} alt="" className="w-5 h-5 rounded-full" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{coin.name}</div>
                      <div className="text-xs text-muted truncate">
                        {query ? highlightMatch(coin.symbol, query) : coin.symbol.toUpperCase()}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-4 py-2 border-t border-border text-[10px] text-muted flex gap-3">
          <span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span>
        </div>
      </div>
    </div>
  )
}

function highlightMatch(text: string, query: string): string {
  const idx = text.toUpperCase().indexOf(query.toUpperCase())
  if (idx < 0) return text
  return `${text.slice(0, idx)}<mark class="bg-yellow-200 dark:bg-yellow-700 rounded">${text.slice(idx, idx + query.length)}</mark>${text.slice(idx + query.length)}`
}

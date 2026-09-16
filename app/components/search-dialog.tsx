'use client'

import { useEffect, useState, useRef } from 'react'
import { searchCoins } from '../../lib/crypto'
import Link from 'next/link'

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchCoins>> | null>(null)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!open || !query.trim()) return
    setLoading(true)
    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      searchCoins(query).then(data => { setResults(data); setLoading(false) }).catch(() => { setLoading(false) })
    }, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [open, query])

  const handleClose = () => { setOpen(false); setQuery(''); setResults(null) }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 text-sm text-muted hover:border-accent transition"
      >
        <span>🔍</span>
        <span className="hidden sm:inline">Search coins...</span>
        <kbd className="text-xs border border-border rounded px-1">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24" onClick={handleClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search coins, tokens..."
          className="w-full px-4 py-3 bg-transparent text-sm outline-none placeholder:text-muted"
        />

        {query.trim() && (
          <div className="max-h-80 overflow-y-auto border-t border-border">
            {loading ? (
              <div className="px-4 py-3 text-sm text-muted">Searching...</div>
            ) : results?.length ? (
              results.slice(0, 8).map(c => (
                <Link
                  key={c.id}
                  href={`/cryptocurrency/${c.id}`}
                  onClick={handleClose}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/10 transition text-sm"
                >
                  <img src={c.image} alt={`${c.name} logo`} className="w-5 h-5 rounded-full" />
                  <div>
                    <span className="font-medium">{c.name}</span>{' '}
                    <span className="text-muted">/{c.symbol.toUpperCase()}</span>
                    {c.market_cap_rank && (
                      <span className="text-muted text-xs ml-2">#{c.market_cap_rank}</span>
                    )}
                  </div>
                </Link>
              ))
            ) : query.trim().length > 1 ? (
              <div className="px-4 py-3 text-sm text-muted">No results found.</div>
            ) : null}
          </div>
        )}

        {!query.trim() && (
          <div className="px-4 py-6 text-center text-sm text-muted">Type to search cryptocurrency...</div>
        )}
      </div>
    </div>
  )
}

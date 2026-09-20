'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { calculatePortfolio, formatUnits, MAX_BACKUP_BYTES, MONEY_SCALE, parsePortfolio, PORTFOLIO_KEY, QUANTITY_SCALE, savePortfolio, serializePortfolio, TRANSACTION_TYPES } from '@/lib/portfolio'
import type { PortfolioTransaction, TransactionType } from '@/lib/portfolio'

const money = (value: bigint | null) => value === null ? 'Unavailable' : `$${formatUnits(value, MONEY_SCALE, 2)}`
const quantityText = (value: bigint) => formatUnits(value, QUANTITY_SCALE, 18).replace(/\.?0+$/, '') || '0'
const message = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Your saved portfolio has not been replaced.'
const label = (type: string) => type.replaceAll('_', ' ')
const localDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 23)
const blank = () => ({ assetId: 'bitcoin', type: 'BUY' as TransactionType, quantity: '', price: '', fees: '0', date: localDate(new Date()), notes: '' })

function download(raw: string, name: string) {
  const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function Portfolio() {
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>([])
  const [ready, setReady] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const savedRaw = useRef<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [draft, setDraft] = useState(blank)
  const [editing, setEditing] = useState<string | null>(null)
  const [quotes, setQuotes] = useState<Record<string, unknown>>({})
  const [quoteError, setQuoteError] = useState('')
  const [quoteTime, setQuoteTime] = useState('')
  const [loadingQuotes, setLoadingQuotes] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      savedRaw.current = localStorage.getItem(PORTFOLIO_KEY)
      setTransactions(savedRaw.current === null ? [] : parsePortfolio(savedRaw.current))
    } catch (e) {
      setBlocked(true)
      setError(`Local data could not be loaded: ${message(e)} Download the original data before restoring or resetting.`)
    }
    setReady(true)
    const changed = (event: StorageEvent) => {
      if (event.key === PORTFOLIO_KEY || event.key === null) {
        setBlocked(true)
        setError('Local storage changed in another tab. Reload this page before editing to avoid losing changes.')
      }
    }
    window.addEventListener('storage', changed)
    return () => window.removeEventListener('storage', changed)
  }, [])

  const portfolio = useMemo(() => calculatePortfolio(transactions, quotes), [transactions, quotes])
  const assetKey = portfolio.holdings.filter(h => h.quantity > BigInt(0)).map(h => h.assetId).join(',')
  useEffect(() => {
    setQuotes({})
    setQuoteError('')
    setQuoteTime('')
    if (!assetKey) { setLoadingQuotes(false); return }
    const controller = new AbortController()
    let active = true
    const timeout = setTimeout(() => controller.abort(), 20_000)
    setLoadingQuotes(true)
    const ids = assetKey.split(',')
    const chunks: string[][] = []
    for (let i = 0; i < ids.length; i += 100) chunks.push(ids.slice(i, i + 100))
    Promise.all(chunks.map(async batch => {
      const query = new URLSearchParams({ ids: batch.join(','), vs_currency: 'usd' })
      const response = await fetch(`/api/coins?${query}`, { signal: controller.signal, cache: 'no-store' })
      if (!response.ok) throw new Error('USD prices could not be fetched. Try refreshing quotes.')
      const body: unknown = await response.json()
      if (!body || typeof body !== 'object' || !('data' in body) || !Array.isArray(body.data)) throw new Error('Price service returned an invalid response.')
      return body.data
    })).then(batches => {
      if (!active) return
      const next: Record<string, unknown> = Object.create(null)
      for (const coin of batches.flat()) {
        if (coin && typeof coin === 'object' && typeof coin.id === 'string' && ids.includes(coin.id)) next[coin.id] = coin.current_price
      }
      setQuotes(next)
      setQuoteTime(new Date().toLocaleTimeString())
    }).catch(e => {
      if (active) setQuoteError(controller.signal.aborted ? 'Price request timed out. Refresh quotes to retry.' : message(e))
    }).finally(() => {
      clearTimeout(timeout)
      if (active) setLoadingQuotes(false)
    })
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [assetKey, refresh])

  function commit(next: PortfolioTransaction[], success: string, recovery = false) {
    if (!ready || (blocked && !recovery)) return false
    try {
      const raw = savePortfolio(localStorage, next, savedRaw.current)
      savedRaw.current = raw
      setTransactions(next)
      setBlocked(false)
      setError('')
      setNotice(success)
      return true
    } catch (e) { setError(message(e)); setNotice(''); return false }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const transaction: PortfolioTransaction = { ...draft, assetId: draft.assetId.trim().toLowerCase(), id: editing ?? crypto.randomUUID(), date: new Date(draft.date).toISOString() }
      const next = editing ? transactions.map(t => t.id === editing ? transaction : t) : [...transactions, transaction]
      if (commit(next, editing ? 'Transaction updated and saved on this browser.' : 'Transaction added and saved on this browser.')) {
        setEditing(null)
        setDraft(blank())
      }
    } catch (e) { setError(message(e)) }
  }

  async function restore(file: File) {
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('Backup is too large (8 MB maximum).')
      const next = parsePortfolio(await file.text())
      if (!window.confirm(`Replace the local portfolio with ${next.length} transactions from ${file.name}? Export a backup first. This cannot be undone.`)) return
      if (commit(next, 'Backup restored and saved on this browser.', true)) { setEditing(null); setDraft(blank()) }
    } catch (e) { setError(message(e)) }
  }

  function backup(original = false) {
    try {
      const raw = original ? savedRaw.current : serializePortfolio(transactions)
      if (raw === null) throw new Error('No readable saved data is available to download.')
      download(raw, `blockdetails-portfolio${original ? '-original' : ''}-${new Date().toISOString().slice(0, 10)}.json`)
      setNotice('Backup download requested. Keep the JSON file somewhere safe; notes and holdings are unencrypted.')
    } catch (e) { setError(message(e)) }
  }

  if (!ready) return <p className="text-sm text-muted-foreground" role="status">Loading your local portfolio…</p>
  const hasPrice = ['BUY', 'SELL', 'TRANSFER_IN'].includes(draft.type)
  return <div className="space-y-5">
    <section className="rounded-lg border bg-card p-4 space-y-3" aria-label="Local storage and backups">
      <p className="text-sm"><strong>Local only · USD accounting.</strong> No accounts, sync, wallet connection, or real trades. Records stay in this browser on this device. Clearing site data or private browsing can erase them. Export a backup regularly.</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => backup()} disabled={blocked}>Export JSON backup</Button>
        <Button variant="outline" onClick={() => fileRef.current?.click()}>Restore JSON backup</Button>
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" aria-label="Portfolio JSON backup" onChange={e => { const file = e.target.files?.[0]; if (file) void restore(file); e.target.value = '' }} />
        {blocked && <>
          <Button variant="outline" onClick={() => backup(true)}>Download original data</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>Reload saved data</Button>
          <Button variant="destructive" onClick={() => {
            if (window.confirm('Permanently replace the saved portfolio with an empty one? Download the original data first.')) {
              if (commit([], 'Local portfolio reset.', true)) { setEditing(null); setDraft(blank()) }
            }
          }}>Reset local portfolio</Button>
        </>}
      </div>
    </section>
    {error && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
    {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
    {!blocked && <>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Portfolio summary">
        {[
          ['Market value', money(portfolio.marketValue)], ['Remaining cost basis', money(portfolio.cost)],
          ['Tracked invested value', money(portfolio.trackedCost)],
          ['Realized P/L', money(portfolio.realized)], ['Unrealized P/L', money(portfolio.unrealized)],
          ['Total P/L', money(portfolio.totalProfit)], ['Total P/L %', portfolio.profitPercent === null ? 'Unavailable' : `${portfolio.profitPercent}%`],
        ].map(([title, value]) => <div key={title} className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">{title}</p><p className="mt-1 break-words text-lg font-semibold tabular-nums">{value}</p></div>)}
      </section>
      <section className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">Holdings</h2><Button variant="outline" disabled={loadingQuotes || !assetKey} onClick={() => setRefresh(n => n + 1)}>{loadingQuotes ? 'Fetching quotes…' : 'Refresh USD quotes'}</Button></div>
        {quoteTime && <p className="text-xs text-muted-foreground">USD quotes fetched at {quoteTime}; not streaming. Refresh for newer prices.</p>}
        {quoteError && <p role="alert" className="text-sm text-destructive">{quoteError}</p>}
        {!!portfolio.missingPrices.length && <p role="status" className="text-sm text-muted-foreground">{loadingQuotes ? 'Loading USD quotes.' : `Missing USD quotes: ${portfolio.missingPrices.join(', ')}.`} Market value, total/unrealized P/L and allocations remain unavailable until all held assets have valid prices.</p>}
        {!portfolio.holdings.length ? <p className="text-sm text-muted-foreground">No holdings yet. Add your first transaction below.</p> : <div className="overflow-x-auto"><table className="w-full text-sm tabular-nums"><caption className="sr-only">Holdings and USD profit or loss, including closed positions</caption><thead><tr className="border-b text-left text-xs text-muted-foreground">{['Asset ID', 'Quantity', 'Average cost', 'Cost basis', 'Value', 'Unrealized P/L', 'Realized P/L', 'Allocation'].map(h => <th key={h} scope="col" className="whitespace-nowrap px-2 py-2 font-medium">{h}</th>)}</tr></thead><tbody>{portfolio.holdings.map(h => <tr key={h.assetId} className="border-b last:border-0"><th scope="row" className="px-2 py-3 text-left font-medium">{h.assetId}</th><td className="px-2 py-3">{quantityText(h.quantity)}</td>{[h.averageCost, h.cost, h.marketValue, h.unrealized, h.realized].map((v, i) => <td key={i} className="whitespace-nowrap px-2 py-3">{money(v)}</td>)}<td className="px-2 py-3">{h.allocation === null ? 'Unavailable' : `${h.allocation}%`}</td></tr>)}</tbody></table></div>}
      </section>
    </>}
    <section className="rounded-lg border bg-card p-4 space-y-3">
      <h2 className="font-semibold">{editing ? 'Edit transaction' : 'Add transaction'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <fieldset disabled={blocked} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 disabled:opacity-60">
          <label className="space-y-1 text-xs">Asset ID<Input required value={draft.assetId} maxLength={100} placeholder="bitcoin" onChange={e => setDraft({ ...draft, assetId: e.target.value })} /><span className="block text-muted-foreground">Use the ID from the coin URL, not its ticker (bitcoin, not BTC).</span></label>
          <label className="space-y-1 text-xs">Transaction type<select className="h-7 w-full rounded-md border border-input bg-background px-2 text-xs" value={draft.type} onChange={e => { const type = e.target.value as TransactionType; setDraft({ ...draft, type, price: ['BUY', 'SELL', 'TRANSFER_IN'].includes(type) ? draft.price : '0' }) }}>{TRANSACTION_TYPES.map(type => <option key={type} value={type}>{label(type)}</option>)}</select></label>
          <label className="space-y-1 text-xs">Quantity<Input required inputMode="decimal" value={draft.quantity} placeholder="0.00" onChange={e => setDraft({ ...draft, quantity: e.target.value })} /></label>
          <label className="space-y-1 text-xs">{draft.type === 'TRANSFER_IN' ? 'Acquisition cost per unit (USD)' : 'Price per unit (USD)'}<Input required disabled={!hasPrice} inputMode="decimal" value={draft.price} placeholder="0.00" onChange={e => setDraft({ ...draft, price: e.target.value })} /></label>
          <label className="space-y-1 text-xs">Total fee (USD)<Input required inputMode="decimal" value={draft.fees} onChange={e => setDraft({ ...draft, fees: e.target.value })} /></label>
          <label className="space-y-1 text-xs">Date and time (your local timezone)<Input required type="datetime-local" step="0.001" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} /></label>
          <label className="space-y-1 text-xs sm:col-span-2 lg:col-span-3">Notes (optional)<Input value={draft.notes} maxLength={1000} onChange={e => setDraft({ ...draft, notes: e.target.value })} /></label>
        </fieldset>
        <div className="flex gap-2"><Button type="submit" disabled={blocked}>{editing ? 'Save changes' : 'Add transaction'}</Button>{editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setDraft(blank()); setError('') }}>Cancel edit</Button>}</div>
      </form>
    </section>
    {!blocked && <section className="rounded-lg border bg-card p-4 space-y-3">
      <h2 className="font-semibold">Transactions <span className="text-sm font-normal text-muted-foreground">({transactions.length})</span></h2>
      {!transactions.length ? <p className="text-sm text-muted-foreground">Only transactions you enter appear here. Nothing is bought or sold.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><caption className="sr-only">Local portfolio transactions in newest-first order</caption><thead><tr className="border-b text-left text-xs text-muted-foreground">{['Date (local)', 'Asset / type', 'Quantity', 'Unit price (USD)', 'Fee (USD)', 'Notes', 'Actions'].map(h => <th key={h} scope="col" className="whitespace-nowrap px-2 py-2 font-medium">{h}</th>)}</tr></thead><tbody>{transactions.map((t, order) => ({ ...t, order })).sort((a, b) => b.date.localeCompare(a.date) || b.order - a.order).map(t => <tr key={t.id} className="border-b last:border-0"><td className="whitespace-nowrap px-2 py-3">{new Date(t.date).toLocaleString()}</td><th scope="row" className="px-2 py-3 text-left font-medium">{t.assetId}<span className="block whitespace-nowrap text-xs text-muted-foreground">{label(t.type)}</span></th><td className="px-2 py-3 tabular-nums">{t.quantity}</td><td className="px-2 py-3 tabular-nums">${t.price}</td><td className="px-2 py-3 tabular-nums">${t.fees}</td><td className="min-w-32 max-w-xs break-words px-2 py-3">{t.notes || '—'}</td><td className="px-2 py-3"><div className="flex gap-2"><Button variant="outline" aria-label={`Edit ${label(t.type)} ${t.assetId} ${t.date}`} onClick={() => { setEditing(t.id); setDraft({ assetId: t.assetId, type: t.type, quantity: t.quantity, price: t.price, fees: t.fees, date: localDate(new Date(t.date)), notes: t.notes }); setError(''); setNotice('Editing transaction in the form above.'); }}>Edit</Button><Button variant="destructive" aria-label={`Delete ${label(t.type)} ${t.assetId} ${t.date}`} onClick={() => {
        if (window.confirm(`Delete ${label(t.type)} of ${t.quantity} ${t.assetId} on ${new Date(t.date).toLocaleString()}? This cannot be undone.`)) {
          if (commit(transactions.filter(item => item.id !== t.id), 'Transaction deleted and saved.')) { if (editing === t.id) { setEditing(null); setDraft(blank()) } }
        }
      }}>Delete</Button></div></td></tr>)}</tbody></table></div>}
    </section>}
    <details className="rounded-lg border bg-card p-4 text-sm" open>
      <summary className="cursor-pointer font-medium">Accounting policy and limitations</summary>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-muted-foreground">
        <li>Weighted-average cost in USD only, independent of the site display currency. Enter fees as total USD amounts, not per unit. Buy/transfer-in fees increase cost basis. Sell fees reduce proceeds exactly once.</li>
        <li>Transfer in: supply original acquisition cost per unit. Transfer out: remove proportional cost, with no sale proceeds or realized gain; its USD fee is an immediate expense in realized P/L. Token-denominated fees must also be reflected in the quantity leaving your holdings.</li>
        <li>Rewards, airdrops and staking rewards use zero purchase cost, plus any USD fee. They do not recognize income on receipt. This is a tracking convention, not tax treatment.</li>
        <li>Total P/L = realized + unrealized. Percentage divides total P/L by all acquisition costs (including sold units), less transferred-out basis, plus transfer-out fees. A zero denominator is unavailable. This is not a time-weighted or annualized return.</li>
        <li>Transactions run chronologically; equal timestamps use the saved entry order. Editing preserves that order. Backdated changes and deletions that cause overselling are rejected. Input precision is 18 decimals; proportional USD basis uses 36 decimals, with the final disposal consuming rounding residue. Displayed USD amounts round to cents.</li>
        <li>For personal tracking only: not financial, investment or tax advice. Quotes may be delayed or unavailable, and an unmapped asset ID may have no quote. Exported backups contain unencrypted transaction details and notes.</li>
      </ul>
    </details>
  </div>
}

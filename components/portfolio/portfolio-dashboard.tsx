'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { usePortfolio } from '@/components/portfolio-provider'
import { PortfolioSidebar } from '@/components/portfolio/portfolio-sidebar'
import { PortfolioHeader } from '@/components/portfolio/portfolio-header'
import { PortfolioHistoryChart } from '@/components/portfolio/portfolio-history-chart'
import { PortfolioAllocation } from '@/components/portfolio/portfolio-allocation'
import { HoldingsTable } from '@/components/portfolio/portfolio-holdings-table'
import { TransactionForm } from '@/components/portfolio/transaction-form'
import { useQuotes } from '@/components/portfolio-quotes'
import { calculatePortfolio, getPortfolioTransactions, MONEY_SCALE, formatUnits } from '@/lib/portfolio'
import type { Coin } from '@/lib/crypto/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { Plus, RefreshCw, Menu } from 'lucide-react'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'
import type { PortfolioTransaction } from '@/lib/portfolio'

export function PortfolioDashboard() {
  const { data, ready, blocked, error, notice, setError, setNotice, getTransactions, addTransaction, updateTransaction, removeTransaction } = usePortfolio()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showTxForm, setShowTxForm] = useState(false)
  const [editingTx, setEditingTx] = useState<PortfolioTransaction | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Get transactions for the selected scope
  const transactions = useMemo(() => {
    if (selectedId === null) {
      // Overview: all transactions
      return Object.values(data.transactions).flat()
    }
    return getTransactions(selectedId)
  }, [data.transactions, selectedId, getTransactions])

  // Get asset IDs that have holdings
  const assetIds = useMemo(() => {
    const ids = new Set<string>()
    for (const tx of transactions) ids.add(tx.assetId)
    return [...ids]
  }, [transactions])

  // Fetch quotes
  const { quotes, loading: quotesLoading, error: quotesError, refresh: refreshQuotes } = useQuotes(assetIds, refreshKey)

  // Calculate portfolio summary
  const summary = useMemo(() => {
    return calculatePortfolio(transactions, quotes)
  }, [transactions, quotes])

  // Fetch coin metadata for display
  const [coins, setCoins] = useState<Record<string, Coin>>({})
  const [coinsLoading, setCoinsLoading] = useState(false)

  const fetchCoins = useCallback(async (ids: string[]) => {
    if (ids.length === 0) { setCoins({}); return }
    setCoinsLoading(true)
    try {
      const results = await Promise.allSettled(
        ids.map(async id => {
          const res = await fetch(`/api/coins/${encodeURIComponent(id)}`)
          if (!res.ok) throw new Error(`Failed: ${id}`)
          const json = await res.json()
          return json.data as Coin
        })
      )
      const coinMap: Record<string, Coin> = {}
      for (const r of results) {
        if (r.status === 'fulfilled') coinMap[r.value.id] = r.value
      }
      setCoins(coinMap)
    } catch {
      // Partial failure is OK
    } finally {
      setCoinsLoading(false)
    }
  }, [])

  // Fetch coins when asset IDs change
  useEffect(() => {
    fetchCoins(assetIds)
  }, [assetIds, fetchCoins])

  // Portfolio name for header
  const portfolioName = selectedId === null
    ? 'All Portfolios'
    : (data.portfolios.find(p => p.id === selectedId)?.name ?? 'Portfolio')

  // Portfolio values for allocation panel
  const portfolioValues = useMemo(() => {
    return data.portfolios.map(p => {
      const txs = getTransactions(p.id)
      const s = calculatePortfolio(txs, quotes)
      return { name: p.name, value: s.marketValue ?? BigInt(0), color: p.color }
    })
  }, [data.portfolios, data.transactions, quotes, getTransactions])

  if (!ready) return <p className="text-sm text-muted-foreground" role="status">Loading portfolio…</p>

  if (data.portfolios.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <EmptyState message="You don't have a portfolio yet." />
        <p className="text-sm text-muted-foreground">Create your first portfolio to start tracking assets.</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6 min-h-0">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-20 border border-border rounded-lg bg-card max-h-[calc(100vh-6rem)] overflow-y-auto">
          <PortfolioSidebar selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <PortfolioSidebar
        selectedId={selectedId}
        onSelect={setSelectedId}
        isMobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-5">
        {/* Mobile header with menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setMobileMenuOpen(true)} aria-label="Open portfolio menu">
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{portfolioName}</span>
        </div>

        {/* Error/notice */}
        {error && <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
        {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}

        {/* Total value header */}
        <PortfolioHeader summary={summary} portfolioName={portfolioName} />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => { setEditingTx(null); setShowTxForm(true) }}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Transaction
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setRefreshKey(k => k + 1); refreshQuotes() }} disabled={quotesLoading}>
            <RefreshCw className={cn('h-3.5 w-3.5 mr-1', quotesLoading && 'animate-spin')} /> Refresh
          </Button>
          {quotesError && <span className="text-xs text-muted-foreground">{quotesError}</span>}
        </div>

        {/* Missing prices notice */}
        {summary.missingPrices.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Missing quotes: {summary.missingPrices.join(', ')}. Market value and P/L may be unavailable.
          </p>
        )}

        {/* Chart + Allocation row */}
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-lg border bg-card p-4">
            <PortfolioHistoryChart transactions={transactions} assetIds={assetIds} />
          </div>
          <div className="lg:col-span-2 rounded-lg border bg-card p-4">
            <PortfolioAllocation
              summary={summary}
              portfolioMode={selectedId === null}
              portfolioValues={portfolioValues}
            />
          </div>
        </div>

        {/* Holdings table */}
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold mb-3">Holdings</h2>
          <HoldingsTable
            summary={summary}
            coins={coins}
            showPortfolioColumn={selectedId === null && data.portfolios.length > 1}
          />
        </div>

        {/* Transaction form dialog */}
        <TransactionForm
          open={showTxForm}
          onClose={() => { setShowTxForm(false); setEditingTx(null) }}
          onSave={(tx) => {
            if (editingTx) {
              updateTransaction(selectedId ?? data.portfolios[0].id, tx)
            } else {
              addTransaction(selectedId ?? data.portfolios[0].id, tx)
            }
          }}
          initialTx={editingTx}
        />
      </main>
    </div>
  )
}



'use client'

import { useState, useMemo } from 'react'
import { formatUnits, MONEY_SCALE, QUANTITY_SCALE, formatUnits as formatQty, type PortfolioSummary } from '@/lib/portfolio'
import { cn } from '@/lib/cn'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import Link from 'next/link'
import { CoinIdentity } from '@/components/coin-identity'
import type { Coin } from '@/lib/crypto/types'

type SortKey = 'asset' | 'allocation' | 'price' | 'change1h' | 'change24h' | 'change7d' | 'balance' | 'value'

type HoldingsTableProps = {
  summary: PortfolioSummary
  coins: Record<string, Coin>
  showPortfolioColumn?: boolean
  portfolioBreakdown?: Record<string, { name: string; color: string }[]>
}

const money = (v: bigint | null) => v === null ? '—' : `$${formatUnits(v, MONEY_SCALE, 2)}`
const qty = (v: bigint) => formatUnits(v, QUANTITY_SCALE, 6).replace(/\.?0+$/, '') || '0'

export function HoldingsTable({ summary, coins, showPortfolioColumn }: HoldingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('value')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sortedHoldings = useMemo(() => {
    const holdings = summary.holdings.filter(h => h.quantity > BigInt(0))
    const sorted = [...holdings].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'asset': cmp = a.assetId.localeCompare(b.assetId); break
        case 'allocation': cmp = (parseFloat(a.allocation ?? '0')) - (parseFloat(b.allocation ?? '0')); break
        case 'balance': cmp = a.quantity > b.quantity ? 1 : -1; break
        case 'value': cmp = (a.marketValue ?? BigInt(0)) > (b.marketValue ?? BigInt(0)) ? 1 : -1; break
        default: cmp = 0
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [summary.holdings, sortKey, sortDir])

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (sortedHoldings.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No assets yet. Add a transaction to begin tracking.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <caption className="sr-only">Portfolio holdings</caption>
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th scope="col" className="px-2 py-2 font-medium">
              <button onClick={() => handleSort('asset')} className="flex items-center gap-1 hover:text-foreground">
                Asset <SortIcon col="asset" />
              </button>
            </th>
            {showPortfolioColumn && (
              <th scope="col" className="px-2 py-2 font-medium">Portfolio</th>
            )}
            <th scope="col" className="px-2 py-2 font-medium text-right">
              <button onClick={() => handleSort('allocation')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                Allocation <SortIcon col="allocation" />
              </button>
            </th>
            <th scope="col" className="px-2 py-2 font-medium text-right">Price</th>
            <th scope="col" className="px-2 py-2 font-medium text-right">1h %</th>
            <th scope="col" className="px-2 py-2 font-medium text-right">24h %</th>
            <th scope="col" className="px-2 py-2 font-medium text-right">7d %</th>
            <th scope="col" className="px-2 py-2 font-medium text-right">
              <button onClick={() => handleSort('balance')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                Balance <SortIcon col="balance" />
              </button>
            </th>
            <th scope="col" className="px-2 py-2 font-medium text-right">
              <button onClick={() => handleSort('value')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                Value <SortIcon col="value" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedHoldings.map(h => {
            const coin = coins[h.assetId]
            return (
              <tr key={h.assetId} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-2 py-3">
                  <Link href={`/cryptocurrency/${h.assetId}`} className="hover:underline">
                    <CoinIdentity
                      name={coin?.name ?? h.assetId}
                      symbol={coin?.symbol}
                      image={coin?.image}
                      size="sm"
                    />
                  </Link>
                </td>
                {showPortfolioColumn && (
                  <td className="px-2 py-3">
                    <span className="text-xs text-muted-foreground">All</span>
                  </td>
                )}
                <td className="px-2 py-3 text-right">{h.allocation ?? '—'}%</td>
                <td className="px-2 py-3 text-right">
                  {coin?.current_price != null ? `$${coin.current_price.toLocaleString()}` : '—'}
                </td>
                <td className={cn('px-2 py-3 text-right', (coin?.price_change_percentage_1h_in_currency ?? 0) >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {coin?.price_change_percentage_1h_in_currency != null ? `${coin.price_change_percentage_1h_in_currency.toFixed(2)}%` : '—'}
                </td>
                <td className={cn('px-2 py-3 text-right', (coin?.price_change_percentage_24h ?? 0) >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {coin?.price_change_percentage_24h != null ? `${coin.price_change_percentage_24h.toFixed(2)}%` : '—'}
                </td>
                <td className={cn('px-2 py-3 text-right', (coin?.price_change_percentage_7d_in_currency ?? 0) >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {coin?.price_change_percentage_7d_in_currency != null ? `${coin.price_change_percentage_7d_in_currency.toFixed(2)}%` : '—'}
                </td>
                <td className="px-2 py-3 text-right">{qty(h.quantity)}</td>
                <td className="px-2 py-3 text-right font-medium">{money(h.marketValue)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import { useMemo } from 'react'
import { formatUnits, MONEY_SCALE, type PortfolioSummary } from '@/lib/portfolio'
import { cn } from '@/lib/cn'
import { TrendingUp, TrendingDown } from 'lucide-react'

type PortfolioHeaderProps = {
  summary: PortfolioSummary
  portfolioName: string
}

export function PortfolioHeader({ summary, portfolioName }: PortfolioHeaderProps) {
  const marketValue = summary.marketValue
  const unrealized = summary.unrealized

  // 24h change: we approximate from unrealized since we don't have historical portfolio value
  // For now, show unrealized as the "change" indicator
  // TODO: implement proper 24h portfolio change from historical data
  const change24h = unrealized
  const changePercent = summary.trackedCost > BigInt(0) && change24h !== null
    ? formatUnits(change24h * BigInt(10000) / summary.trackedCost, 2, 2)
    : null

  const isPositive = change24h !== null && change24h >= BigInt(0)

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{portfolioName}</p>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold tabular-nums">
          {marketValue !== null ? `$${formatUnits(marketValue, MONEY_SCALE, 2)}` : '—'}
        </span>
      </div>
      {change24h !== null && (
        <div className={cn('flex items-center gap-1.5 text-sm', isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500')}>
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span className="tabular-nums">
            {isPositive ? '+' : ''}{formatUnits(change24h, MONEY_SCALE, 2)}
          </span>
          {changePercent !== null && (
            <span className="tabular-nums">({isPositive ? '+' : ''}{changePercent}%)</span>
          )}
          <span className="text-muted-foreground ml-1">unrealized</span>
        </div>
      )}
    </div>
  )
}

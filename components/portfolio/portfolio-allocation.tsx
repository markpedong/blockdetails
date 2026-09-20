'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { PortfolioSummary } from '@/lib/portfolio'

type AllocationMode = 'token' | 'portfolio'

type AllocationPanelProps = {
  summary: PortfolioSummary
  portfolioMode: boolean  // true = Overview mode (show portfolio allocation tab)
  portfolioValues?: { name: string; value: bigint; color: string }[]
}

const CHART_COLORS = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5']

export function PortfolioAllocation({ summary, portfolioMode, portfolioValues }: AllocationPanelProps) {
  const [mode, setMode] = useState<AllocationMode>(portfolioMode ? 'token' : 'token')

  const holdings = summary.holdings.filter(h => h.quantity > BigInt(0) && h.marketValue !== null)
  const totalValue = summary.marketValue

  // Token allocation
  const tokenAllocations = holdings
    .map(h => ({
      label: h.assetId,
      value: h.marketValue!,
      pct: h.allocation ?? '0',
    }))
    .sort((a, b) => (b.value > a.value ? 1 : -1))

  // Group small allocations into "Others"
  const TOKEN_THRESHOLD = 2 // percent
  const mainTokens = tokenAllocations.filter(t => parseFloat(t.pct ?? '0') >= TOKEN_THRESHOLD)
  const smallTokens = tokenAllocations.filter(t => parseFloat(t.pct ?? '0') < TOKEN_THRESHOLD)
  const othersValue = smallTokens.reduce((sum, t) => sum + t.value, BigInt(0))
  const othersPct = totalValue && totalValue > BigInt(0)
    ? (othersValue * BigInt(10000) / totalValue)
    : BigInt(0)

  const displayTokens = [
    ...mainTokens,
    ...(othersValue > BigInt(0) ? [{ label: 'Others', value: othersValue, pct: (Number(othersPct) / 100).toFixed(2) }] : []),
  ]

  // Portfolio allocation
  const portfolioAllocations = portfolioValues
    ?.filter(p => p.value > BigInt(0))
    .map(p => ({
      label: p.name,
      value: p.value,
      color: p.color,
      pct: totalValue && totalValue > BigInt(0)
        ? (Number(p.value * BigInt(10000) / totalValue) / 100).toFixed(2)
        : '0',
    }))
    .sort((a, b) => (b.value > a.value ? 1 : -1)) ?? []

  const currentAlloc = mode === 'token' ? displayTokens : portfolioAllocations

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Allocation</h2>
        {portfolioMode && (
          <ToggleGroup
            value={[mode]}
            onValueChange={v => v?.[0] && setMode(v[0] as AllocationMode)}
            className="justify-start"
            aria-label="Allocation view"
          >
            <ToggleGroupItem value="token" className="text-xs px-2 py-1 h-6">Token</ToggleGroupItem>
            <ToggleGroupItem value="portfolio" className="text-xs px-2 py-1 h-6">Portfolio</ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      {currentAlloc.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No allocation data</p>
      ) : (
        <div className="flex items-center gap-4">
          {/* Donut chart (simplified as a visual ring) */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              {(() => {
                let offset = 0
                const total = currentAlloc.reduce((s, a) => s + parseFloat(a.pct), 0)
                return currentAlloc.map((a, i) => {
                  const pct = total > 0 ? (parseFloat(a.pct) / total) * 100 : 0
                  const dash = `${pct} ${100 - pct}`
                  const colorVar = 'var(' + (CHART_COLORS[i % CHART_COLORS.length]) + ')'
                  const el = (
                    <circle
                      key={i}
                      cx="18" cy="18" r="15.915"
                      fill="none"
                      stroke={colorVar}
                      strokeWidth="3.5"
                      strokeDasharray={dash}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  )
                  offset += pct
                  return el
                })
              })()}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1.5 min-w-0">
            {currentAlloc.map((a, i) => (
              <div key={a.label} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: mode === 'portfolio'
                    ? (portfolioAllocations.find(p => p.label === a.label)?.color ?? `var(${CHART_COLORS[i % CHART_COLORS.length]})`)
                    : `var(${CHART_COLORS[i % CHART_COLORS.length]})` }}
                />
                <span className="truncate flex-1">{a.label}</span>
                <span className="tabular-nums text-muted-foreground">{a.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

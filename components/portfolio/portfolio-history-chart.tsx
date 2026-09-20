'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { formatPrice } from '@/lib/utils'
import { ErrorState } from '@/components/error-state'
import { cn } from '@/lib/cn'
import type { PortfolioTransaction } from '@/lib/portfolio'

type RangeKey = '24h' | '7d' | '30d' | '90d'
const RANGES: { label: string; key: RangeKey; days: number }[] = [
  { label: '24H', key: '24h', days: 1 },
  { label: '7D', key: '7d', days: 7 },
  { label: '30D', key: '30d', days: 30 },
  { label: '90D', key: '90d', days: 90 },
]

type ChartPoint = { date: string; value: number }

type HistoryChartProps = {
  transactions: PortfolioTransaction[]
  assetIds: string[]
}

export function PortfolioHistoryChart({ transactions, assetIds }: HistoryChartProps) {
  const [range, setRange] = useState<RangeKey>('7d')
  const [data, setData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const days = RANGES.find(r => r.key === range)?.days ?? 7

  useEffect(() => {
    if (assetIds.length === 0) { setData([]); return }
    const controller = new AbortController()
    setLoading(true)
    setError('')

    // Fetch historical prices for each asset
    const fetchHistory = async () => {
      try {
        const results = await Promise.all(
          assetIds.map(async id => {
            const params = new URLSearchParams({ vs_currency: 'usd', days: String(days) })
            const res = await fetch(`/api/coins/${encodeURIComponent(id)}/market_chart?${params}`, { signal: controller.signal })
            if (!res.ok) throw new Error(`Failed chart for ${id}`)
            const json = await res.json()
            if (!Array.isArray(json.data?.prices)) throw new Error('Invalid chart')
            return { id, prices: json.data.prices as [number, number][] }
          })
        )

        // Build portfolio value at each timestamp
        // Sort transactions by date
        const sortedTxs = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
        const rangeStart = Date.now() - days * 86400_000

        // Build price lookup: assetId -> Map<timestampMs, price>
        const priceMaps = new Map<string, Map<number, number>>()
        for (const { id, prices } of results) {
          const m = new Map<number, number>()
          for (const [ts, price] of prices) m.set(ts, price)
          priceMaps.set(id, m)
        }

        // Sample points from the first asset's chart timestamps
        const sampleTimestamps = results[0]?.prices.map(p => p[0]) ?? []
        if (sampleTimestamps.length === 0) { setData([]); setLoading(false); return }

        const points: ChartPoint[] = []
        let holdings = new Map<string, number>()  // assetId -> quantity
        let txIdx = 0

        for (const ts of sampleTimestamps) {
          if (ts < rangeStart) {
            // Process transactions but don't add to chart yet
            while (txIdx < sortedTxs.length && new Date(sortedTxs[txIdx].date).getTime() <= ts) {
              const tx = sortedTxs[txIdx]
              const qty = parseFloat(tx.quantity)
              const current = holdings.get(tx.assetId) ?? 0
              if (tx.type === 'SELL' || tx.type === 'TRANSFER_OUT') {
                holdings.set(tx.assetId, Math.max(0, current - qty))
              } else {
                holdings.set(tx.assetId, current + qty)
              }
              txIdx++
            }
            continue
          }

          // Process all transactions up to this timestamp
          while (txIdx < sortedTxs.length && new Date(sortedTxs[txIdx].date).getTime() <= ts) {
            const tx = sortedTxs[txIdx]
            const qty = parseFloat(tx.quantity)
            const current = holdings.get(tx.assetId) ?? 0
            if (tx.type === 'SELL' || tx.type === 'TRANSFER_OUT') {
              holdings.set(tx.assetId, Math.max(0, current - qty))
            } else {
              holdings.set(tx.assetId, current + qty)
            }
            txIdx++
          }

          // Calculate portfolio value at this point
          let value = 0
          for (const [assetId, qty] of holdings) {
            if (qty <= 0) continue
            const priceMap = priceMaps.get(assetId)
            if (!priceMap) continue
            // Find closest price at or before this timestamp
            let price: number | undefined = priceMap.get(ts)
            if (price === undefined) {
              // Find nearest earlier timestamp
              let best: number | undefined
              let bestDiff = Infinity
              for (const [pts, p] of priceMap) {
                const diff = ts - pts
                if (diff >= 0 && diff < bestDiff) { best = p; bestDiff = diff }
              }
              price = best
            }
            if (price !== undefined) value += qty * price
          }

          if (value > 0) {
            points.push({
              date: new Date(ts).toLocaleString(undefined, {
                month: 'short', day: 'numeric',
                hour: days <= 1 ? '2-digit' : undefined,
                minute: days <= 1 ? '2-digit' : undefined,
              }),
              value,
            })
          }
        }

        if (!controller.signal.aborted) setData(points)
      } catch (e) {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Chart unavailable')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchHistory()
    return () => controller.abort()
  }, [assetIds, transactions, days, retryKey])

  const isUp = data.length > 1 ? data[data.length - 1].value >= data[0].value : true

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">History</h2>
        <ToggleGroup
          value={[range]}
          onValueChange={v => v?.[0] && setRange(v[0] as RangeKey)}
          className="justify-start"
          aria-label="Chart time range"
        >
          {RANGES.map(r => (
            <ToggleGroupItem key={r.key} value={r.key} className="text-xs px-2.5 py-1 h-7">
              {r.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {loading ? (
        <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
          Loading chart...
        </div>
      ) : error ? (
        <div className="h-[250px] flex items-center justify-center">
          <ErrorState message="History unavailable. Provider may restrict historical data." onRetry={() => setRetryKey(k => k + 1)} compact />
        </div>
      ) : data.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
          No history data for this range.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUp ? 'var(--positive)' : 'var(--negative)'} stopOpacity={0.2} />
                <stop offset="95%" stopColor={isUp ? 'var(--positive)' : 'var(--negative)'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v: number) => formatPrice(v, 'usd')} width={70} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null
                const p = payload[0].payload as ChartPoint
                return (
                  <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-sm">
                    <div className="text-muted-foreground">{p.date}</div>
                    <div className="font-semibold tabular-nums">{formatPrice(p.value, 'usd')}</div>
                  </div>
                )
              }}
            />
            <Area type="monotone" dataKey="value" stroke={isUp ? 'var(--positive)' : 'var(--negative)'} strokeWidth={1.5} fill="url(#portfolioChartGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

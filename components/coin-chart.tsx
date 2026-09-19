'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatPrice, formatDate } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type Point = { date: string; price: number }
type RangeKey = '1d' | '7d' | '30d' | '90d' | '1y' | '5y'

const RANGES: { label: string; key: RangeKey; days: number }[] = [
  { label: '1D', key: '1d', days: 1 },
  { label: '7D', key: '7d', days: 7 },
  { label: '30D', key: '30d', days: 30 },
  { label: '90D', key: '90d', days: 90 },
  { label: '1Y', key: '1y', days: 365 },
  { label: 'MAX', key: '5y', days: 1825 },
]

interface CoinChartProps {
  coinId: string
  currency: string
}

export function CoinChart({ coinId, currency }: CoinChartProps) {
  const [range, setRange] = useState<RangeKey>('7d')
  const [data, setData] = useState<Point[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const days = RANGES.find(r => r.key === range)?.days ?? 7
    fetch(`/api/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`)
      .then(r => r.json())
      .then(json => {
        if (json.prices) {
          setData(json.prices.map((p: [number, number]) => ({
            date: formatDate(new Date(p[0]).toISOString(), { month: 'short', day: 'numeric' }),
            price: p[1],
          })))
        } else { setData([]) }
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [coinId, currency, range])

  const isUp = data.length > 1 ? data[data.length - 1].price >= data[0].price : true

  return (
    <div className="space-y-3">
      {/* Time range selector */}
      <ToggleGroup
        value={[range]}
        onValueChange={(v) => v?.[0] && setRange(v[0] as RangeKey)}
        className="justify-start"
        aria-label="Chart time range"
      >
        {RANGES.map(r => (
          <ToggleGroupItem
            key={r.key}
            value={r.key}
            className="text-xs px-2.5 py-1 h-7"
          >
            {r.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Chart */}
      {loading ? (
        <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">Loading chart...</div>
      ) : data.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">No chart data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUp ? 'var(--positive)' : 'var(--negative)'} stopOpacity={0.2} />
                <stop offset="95%" stopColor={isUp ? 'var(--positive)' : 'var(--negative)'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatPrice(v, currency)}
              width={70}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null
                const p = payload[0].payload as { date: string; price: number }
                return (
                  <div className="bg-card border border-border rounded-md px-3 py-2 text-xs shadow-sm">
                    <div className="text-muted-foreground">{p.date}</div>
                    <div className="font-semibold tabular-nums">{formatPrice(p.price, currency)}</div>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isUp ? 'var(--positive)' : 'var(--negative)'}
              strokeWidth={1.5}
              fill="url(#chartGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

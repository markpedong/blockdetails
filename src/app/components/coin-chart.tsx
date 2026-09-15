'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice } from '@/lib/format'

interface Point { date: number; value: number }

const TIMEFRAMES = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 },
  { label: 'MAX', days: '' }
] as const

export function CoinChart({ coinId, currency }: { coinId: string; currency?: string }) {
  const [tf, setTf] = useState<string>(() => {
    if (typeof window === 'undefined') return '7D'
    const saved = localStorage.getItem(`chart_tf_${coinId}`)
    return saved || '7D'
  })

  const [data, setData] = useState<Point[]>([])
  const [loading, setLoading] = useState(true)

  const tfObj = TIMEFRAMES.find(t => t.label === tf) ?? TIMEFRAMES[1]

  useEffect(() => {
    setLoading(true)
    const url = `/api/coins/${coinId}/market_chart?vs_currency=${currency || 'usd'}&days=${tfObj.days}`
    fetch(url).then(r => r.json()).then(d => {
      if (d.prices) setData(d.prices.map((p: [number, number]) => ({ date: p[0], value: p[1] })))
      setLoading(false)
    }).catch(() => { setLoading(false) })
  }, [coinId, tfObj.days, currency])

  // Persist timeframe choice
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`chart_tf_${coinId}`, tf)
    }
  }, [tf, coinId])

  const chartData = data.map(d => ({ ...d, formatted: formatPrice(d.value, currency) }))

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {TIMEFRAMES.map(t => (
          <button
            key={t.label}
            onClick={() => setTf(t.label)}
            className={`px-2.5 py-1 text-xs rounded-full transition ${tf === t.label ? 'bg-accent text-white' : 'border border-border hover:bg-muted/10'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-sm text-muted">Loading chart...</div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm text-muted">No chart data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--muted)' }}
              tickFormatter={(ts: number) => new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              tickLine={false}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fill: 'var(--muted)' }}
              tickFormatter={(v: number) => formatPrice(v, currency)}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null
                const d = payload[0].payload as Point
                return (
                  <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow">
                    <div>{new Date(d.date).toLocaleString()}</div>
                    <div className="font-semibold">{formatPrice(d.value, currency)}</div>
                  </div>
                )
              }}
            />
            <Area type="monotone" dataKey="value" stroke="var(--accent)" fill="url(#chartGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

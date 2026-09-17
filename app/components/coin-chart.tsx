'use client'

import { useState, useEffect, useRef } from 'react'
import { formatPrice, formatCompact } from '@/lib/format'

interface CoinChartProps {
  coinId: string
  currency?: string
}

export function CoinChart({ coinId, currency = 'usd' }: CoinChartProps) {
  const [data, setData] = useState<{ date: string; price: number }[]>([])
  const [range, setRange] = useState('7d')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    async function fetchChart() {
      try {
        const res = await fetch(`/api/coins/${coinId}?currency=${currency}&days=${range}`)
        const json = await res.json()
        if (json.data?.chart) {
          setData(json.data.chart.map((p: { timestamp: number; price: number }) => ({ date: new Date(p.timestamp).toLocaleDateString(), price: p.price })))
        }
      } catch {}
    }
    fetchChart()
  }, [coinId, currency, range])

  // Draw chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const padding = { top: 20, bottom: 30, left: 60, right: 10 }
    const chartW = w - padding.left - padding.right
    const chartH = h - padding.top - padding.bottom

    ctx.clearRect(0, 0, w, h)

    const prices = data.map(d => d.price)
    const minP = Math.min(...prices)
    const maxP = Math.max(...prices)
    const rangeP = maxP - minP || 1

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(w - padding.right, y)
      ctx.stroke()

      // Price labels
      const price = maxP - (rangeP / 4) * i
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(formatPrice(price, currency), padding.left - 5, y + 3)
    }

    // Draw line
    ctx.beginPath()
    data.forEach((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW
      const y = padding.top + ((maxP - d.price) / rangeP) * chartH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom)
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)')
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')

    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2
    ctx.stroke()

    // Fill area
    ctx.lineTo(padding.left + chartW, h - padding.bottom)
    ctx.lineTo(padding.left, h - padding.bottom)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

  }, [data, currency])

  const lastPrice = data.length > 0 ? data[data.length - 1].price : null
  const firstPrice = data.length > 0 ? data[0].price : null
  const changePct = lastPrice && firstPrice ? ((lastPrice - firstPrice) / firstPrice * 100) : null

  return (
    <div className="space-y-4">
      {/* Range selector */}
      <div className="flex gap-2">
        {['1d', '7d', '30d', '90d', '1y'].map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 text-xs rounded-full border transition ${range === r ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Price info */}
      {lastPrice && (
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">{formatPrice(lastPrice, currency)}</span>
          {changePct != null && (
            <span className={`text-sm ${changePct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
            </span>
          )}
        </div>
      )}

      {/* Canvas chart */}
      <canvas ref={canvasRef} className="w-full h-48 rounded-lg border border-border" />
    </div>
  )
}

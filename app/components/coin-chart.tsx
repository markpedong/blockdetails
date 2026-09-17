'use client'

import { useState, useRef, useEffect } from 'react'

type Point = { timestamp: number; price: number }
type Range = '1d' | '7d' | '30d' | '90d' | '1y' | '5y'

const RANGES: { label: string; key: Range; days: number }[] = [
  { label: '24H', key: '1d', days: 1 },
  { label: '7D', key: '7d', days: 7 },
  { label: '30D', key: '30d', days: 30 },
  { label: '90D', key: '90d', days: 90 },
  { label: '1Y', key: '1y', days: 365 },
  { label: '5Y', key: '5y', days: 1825 },
]

export function CoinChart({ coinId, currency }: { coinId: string; currency: string }) {
  const [range, setRange] = useState<Range>('7d')
  const [data, setData] = useState<Point[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/coins/${coinId}/market_chart?vs_currency=${currency}&days=${RANGES.find(r => r.key === range)?.days ?? 7}`)
      .then(r => r.json())
      .then(json => {
        if (json.prices) setData(json.prices.map((p: [number, number]) => ({ timestamp: p[0], price: p[1] })))
      })
      .catch(() => setData([]))
  }, [coinId, currency, range])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const container = canvas.parentElement
    if (!container) return

    const dpr = window.devicePixelRatio || 1
    const w = container.clientWidth
    const h = Math.min(320, Math.max(180, w * 0.4))

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.isolation = 'isolate'

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    const prices = data.map(d => d.price)
    const minP = Math.min(...prices)
    const maxP = Math.max(...prices)
    const range = maxP - minP || 1

    // Dark mode detection via CSS variable
    const isDark = getComputedStyle(document.documentElement).getPropertyValue('--background').trim().startsWith('#1')

    const pad = { top: 20, right: 50, bottom: 30, left: 10 }
    const cw = w - pad.left - pad.right
    const ch = h - pad.top - pad.bottom

    ctx.clearRect(0, 0, w, h)

    // Grid lines
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1

    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (ch / 4) * i
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(w - pad.right, y)
      ctx.stroke()

      // Price labels
      const price = maxP - (range / 4) * i
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace'
      ctx.textAlign = 'right'
      ctx.fillText(formatPriceShort(price, currency), w - 4, y + 3)
    }

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom)
    const isUp = prices[prices.length - 1] >= prices[0]
    if (isUp) {
      gradient.addColorStop(0, 'rgba(22, 163, 74, 0.15)')
      gradient.addColorStop(1, 'rgba(22, 163, 74, 0)')
    } else {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.15)')
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)')
    }

    // Area fill
    ctx.beginPath()
    data.forEach((d, i) => {
      const x = pad.left + (i / (data.length - 1)) * cw
      const y = pad.top + ch - ((d.price - minP) / range) * ch
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.lineTo(pad.left + cw, pad.top + ch)
    ctx.lineTo(pad.left, pad.top + ch)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Line
    ctx.beginPath()
    data.forEach((d, i) => {
      const x = pad.left + (i / (data.length - 1)) * cw
      const y = pad.top + ch - ((d.price - minP) / range) * ch
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = isUp ? '#16a34a' : '#ef4444'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Current price dot
    const lastX = pad.left + cw
    const lastY = pad.top + ch - ((prices[prices.length - 1] - minP) / range) * ch
    ctx.beginPath()
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2)
    ctx.fillStyle = isUp ? '#16a34a' : '#ef4444'
    ctx.fill()

  }, [data, currency])

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} className="w-full rounded" />
      <div className="flex gap-1 mt-2 flex-wrap">
        {RANGES.map(r => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-2.5 py-1 text-[10px] rounded-md border transition ${range === r.key ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function formatPriceShort(price: number, currency: string): string {
  if (price >= 1e6) return `${(price / 1e6).toFixed(2)}M ${currency.toUpperCase()}`
  if (price >= 1e3) return `${(price / 1e3).toFixed(2)}K ${currency.toUpperCase()}`
  return `${price.toFixed(2)} ${currency.toUpperCase()}`
}

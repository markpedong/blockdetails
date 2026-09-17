import type { ReactNode } from 'react'

interface PriceChangeProps {
  value: number | null | undefined
  percentage?: boolean
  className?: string
}

function pctColor(n: number | null | undefined): string {
  if (n == null) return 'text-muted-foreground'
  return n > 0 ? 'text-[var(--positive)]' : n < -0.01 ? 'text-[var(--negative)]' : 'text-muted-foreground'
}

export function PriceChange({ value, percentage = true, className }: PriceChangeProps) {
  if (value == null) return <span className={`tabular-nums ${className || ''}`}>—</span>

  const sign = value > 0 ? '+' : ''
  const display = percentage ? `${sign}${value.toFixed(2)}%` : `${sign}${value.toFixed(2)}`

  return (
    <span className={`tabular-nums ${pctColor(value)} ${className || ''}`}>
      {display}
    </span>
  )
}

// Inline version for single-line use (no wrapper div)
export function PriceChangeInline({ value, percentage = true }: { value: number | null | undefined; percentage?: boolean }) {
  if (value == null) return <span>—</span>

  const sign = value > 0 ? '+' : ''
  const display = percentage ? `${sign}${value.toFixed(2)}%` : `${sign}${value.toFixed(2)}`

  return (
    <span className={`tabular-nums ${pctColor(value)}`}>
      {display}
    </span>
  )
}

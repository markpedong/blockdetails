interface PriceChangeInlineProps {
  value: number | null | undefined
  percentage?: boolean
}

const pctColor = (n: number | null | undefined): string => {
  if (n == null) return 'text-muted-foreground'
  return n > 0 ? 'text-[var(--positive)]' : n < -0.01 ? 'text-[var(--negative)]' : 'text-muted-foreground'
}

export const PriceChangeInline = ({ value, percentage = true }: PriceChangeInlineProps) => {
  if (value == null) return <span>—</span>

  const sign = value > 0 ? '+' : ''
  const display = percentage ? `${sign}${value.toFixed(2)}%` : `${sign}${value.toFixed(2)}`

  return (
    <span className={`tabular-nums ${pctColor(value)}`}>
      {display}
    </span>
  )
}

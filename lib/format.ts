export function formatPrice(n: number | null | undefined, currency = 'usd'): string {
  if (n == null) return '-'
  const c = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: n < 1 ? 4 : n < 100 ? 2 : 0,
    maximumFractionDigits: n < 1 ? 6 : 2
  })
  return c.format(n)
}

export function formatNum(n: number | null | undefined): string {
  if (n == null) return '-'
  return new Intl.NumberFormat('en-US').format(n)
}

export function formatCompact(n: number | null | undefined): string {
  if (n == null) return '-'
  const c = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  return c.format(n)
}

export function formatPct(n: number | null | undefined): string {
  if (n == null) return '-'
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export function pctColor(n: number | null | undefined): string {
  if (n == null) return ''
  return n > 0 ? 'text-emerald-500' : n < -0.01 ? 'text-red-500' : ''
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(n: number | null | undefined, currency = 'usd'): string {
  if (n == null) return '\u2014'
  const c = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: n < 1 ? 4 : n < 100 ? 2 : 0,
    maximumFractionDigits: n < 1 ? 6 : 2,
  })
  return c.format(n)
}

export function formatCompact(n: number | null | undefined): string {
  if (n == null) return '\u2014'
  const c = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  return c.format(n)
}

export function formatPct(n: number | null | undefined): string {
  if (n == null) return '\u2014'
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export function formatNum(n: number | null | undefined): string {
  if (n == null) return '\u2014'
  return new Intl.NumberFormat('en-US').format(n)
}

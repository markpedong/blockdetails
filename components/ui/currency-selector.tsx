'use client'

import { usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CURRENCIES = [
  { value: 'usd', label: 'USD $' },
  { value: 'eur', label: 'EUR €' },
  { value: 'gbp', label: 'GBP £' },
  { value: 'jpy', label: 'JPY ¥' },
  { value: 'aud', label: 'AUD A$' },
  { value: 'php', label: 'PHP ₱' },
] as const

interface CurrencySelectorProps {
  currency?: string
  onCurrencyChange?: (currency: string) => void
  size?: 'sm' | 'default'
}

export function CurrencySelector({ currency = 'usd', onCurrencyChange, size = 'sm' }: CurrencySelectorProps) {
  const current = CURRENCIES.find(c => c.value === currency) || CURRENCIES[0]

  const handleChange = (value: string | null) => {
    if (onCurrencyChange && value !== null) onCurrencyChange(value)
  }

  return (
    <Select value={currency} onValueChange={handleChange}>
      <SelectTrigger className={`${size === 'sm' ? 'h-7 text-xs' : 'h-8 text-sm'} w-[80px]`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map(c => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

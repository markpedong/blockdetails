'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CURRENCIES = [
  { value: 'usd', label: 'USD', symbol: '$' },
  { value: 'eur', label: 'EUR', symbol: '€' },
  { value: 'gbp', label: 'GBP', symbol: '£' },
  { value: 'jpy', label: 'JPY', symbol: '¥' },
  { value: 'btc', label: 'BTC', symbol: '₿' },
]

export function CurrencySelector() {
  const router = useRouter()
  const pathname = usePathname()
  const [currency, setCurrency] = useState('usd')

  const handleChange = (value: string | null) => {
    if (!value) return
    setCurrency(value)
    const params = new URLSearchParams(window.location.search)
    params.set('currency', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={currency} onValueChange={handleChange}>
      <SelectTrigger className="h-8 w-[72px] text-xs border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map(c => (
          <SelectItem key={c.value} value={c.value} className="text-xs">
            {c.symbol} {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

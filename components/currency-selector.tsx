'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SUPPORTED_CURRENCIES, getDefaultCurrency, persistCurrency, type Currency } from '@/lib/currency'

const SYMBOLS: Record<string, string> = { usd: '$', eur: '€', gbp: '£', jpy: '¥', aud: 'A$', php: '₱' }

export function CurrencySelector() {
  const router = useRouter()
  const pathname = usePathname()
  const [currency, setCurrency] = useState<Currency>(getDefaultCurrency)

  const handleChange = (value: string | null) => {
    if (!value) return
    const c = value as Currency
    setCurrency(c)
    persistCurrency(c)
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
        {SUPPORTED_CURRENCIES.map(c => (
          <SelectItem key={c} value={c} className="text-xs">
            {SYMBOLS[c] ?? ''} {c.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

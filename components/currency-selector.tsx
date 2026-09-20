'use client'

import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SUPPORTED_CURRENCIES, getDefaultCurrency, persistCurrency, type Currency } from '@/lib/currency'

const SYMBOLS: Record<string, string> = { usd: '$', eur: '€', gbp: '£', jpy: '¥', aud: 'A$', php: '₱' }

export function CurrencySelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requested = searchParams.get('currency')?.toLowerCase() as Currency | undefined
  const currency = requested && SUPPORTED_CURRENCIES.includes(requested) ? requested : 'usd'

  useEffect(() => {
    if (searchParams.has('currency')) return
    const saved = getDefaultCurrency()
    if (saved === 'usd') return
    const params = new URLSearchParams(searchParams.toString())
    params.set('currency', saved)
    router.replace(`${pathname}?${params}`, { scroll: false })
  }, [pathname, router, searchParams])

  const handleChange = (value: string | null) => {
    if (!value) return
    const c = value as Currency
    if (!SUPPORTED_CURRENCIES.includes(c)) return
    persistCurrency(c)
    const params = new URLSearchParams(window.location.search)
    params.set('currency', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={currency} onValueChange={handleChange}>
      <SelectTrigger aria-label="Display currency" className="h-8 w-[72px] text-xs border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
        <SelectValue>{SYMBOLS[currency]} {currency.toUpperCase()}</SelectValue>
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

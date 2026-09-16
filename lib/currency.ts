export const SUPPORTED_CURRENCIES = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'php'] as const
export type Currency = (typeof SUPPORTED_CURRENCIES)[number]

const KEY = 'blockdetails_currency'

export function getDefaultCurrency(): Currency {
  if (typeof window === 'undefined') return 'usd'
  const saved = localStorage.getItem(KEY) as Currency | null
  if (saved && SUPPORTED_CURRENCIES.includes(saved)) return saved
  // Detect locale-based default
  const locale = navigator.language?.toLowerCase() ?? ''
  if (locale.includes('ph')) return 'php'
  if (locale.includes('jp')) return 'jpy'
  if (locale.includes('gb') || locale.includes('uk')) return 'gbp'
  if (locale.includes('eu') || locale.includes('de') || locale.includes('fr')) return 'eur'
  if (locale.includes('au')) return 'aud'
  return 'usd'
}

export function persistCurrency(currency: Currency): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, currency)
  }
}

export async function parseCurrencyFromUrl(
  searchParams: Promise<Record<string, string | undefined>>,
): Promise<Currency> {
  const params = await searchParams
  const c = (params.currency as string | undefined)?.toLowerCase()
  if (c && SUPPORTED_CURRENCIES.includes(c as Currency)) return c as Currency
  return getDefaultCurrency()
}

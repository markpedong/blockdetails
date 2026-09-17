// Crypto service — orchestrates providers, handles fallback, caching decisions.

import type { CryptoProvider } from './provider'
import type { Coin, CoinDetail, MarketChartPoint, GlobalMarketData, TrendingCoin, ExchangeSummary, ExchangeDetail, ExchangeMarketPair } from './types'
import { CoinGeckoProvider } from './providers/coingecko'
import { CoinMarketCapProvider } from './providers/coinmarketcap'

const primary = new CoinGeckoProvider()
const fallback = new CoinMarketCapProvider()

// Temporary/server error codes that warrant a provider fallback
const RETRYABLE_STATUS = new Set([429, 502, 503, 504])

async function tryProvider<T>(provider: CryptoProvider, fn: () => Promise<T>, fallbackFn?: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    const fetchErr = err as { status?: number; code?: string }
    // Retry on temporary errors with fallback provider
    if (fetchErr.status && RETRYABLE_STATUS.has(fetchErr.status) && fallbackFn) {
      return await fallbackFn()
    }
    if (fetchErr.code === 'ABORT_SIGNAL_TIMEOUT' && fallbackFn) {
      return await fallbackFn()
    }
    throw err
  }
}

// Helper: check if a response is an error and throw with status for tryProvider to catch
export async function ensureOk(res: Response): Promise<unknown> {
  if (!res.ok) throw Object.assign(new Error(`${res.status} ${res.statusText}`), { status: res.status })
  return res.json()
}

// ── Public API (mirrors CryptoProvider interface) ────────────

export async function getCoinsList(currency?: string): Promise<Pick<Coin, 'id' | 'symbol' | 'name'>[]> {
  const result = await primary.getCoinsList(currency)
  return result ?? []
}

export async function getCoinsPaginated(currency: string, order?: string, perPage = 50, page = 1): Promise<{ data: Coin[]; total_count: number }> {
  const result = await tryProvider(
    primary,
    () => primary.getCoinsPaginated(currency, order, perPage, page),
    () => fallback.getCoinsPaginated(currency),
  )
  return result ?? { data: [], total_count: 0 }
}

export async function getCoinDetail(slug: string, currency = 'usd'): Promise<CoinDetail | null> {
  return tryProvider(
    primary,
    () => primary.getCoinDetail(slug, currency),
    () => fallback.getCoinDetail(slug, currency),
  )
}

export async function getMarketChart(slug: string, currency = 'usd', days = 1): Promise<MarketChartPoint[]> {
  const result = await tryProvider(
    primary,
    () => primary.getMarketChart(slug, currency, days),
    () => fallback.getMarketChart(slug, currency, days),
  )
  return result ?? []
}

export async function getTrending(): Promise<TrendingCoin[]> {
  const result = await tryProvider(
    primary,
    () => primary.getTrending(),
    () => fallback.getTrending(),
  )
  return result ?? []
}

export async function searchCoins(query: string, currency = 'usd'): Promise<Pick<Coin, 'id' | 'symbol' | 'name' | 'market_cap_rank' | 'image'>[]> {
  const result = await tryProvider(
    primary,
    () => primary.searchCoins(query, currency),
    () => fallback.searchCoins(query, currency),
  )
  return result ?? []
}

export async function getGlobalData(currency = 'usd'): Promise<GlobalMarketData | null> {
  return tryProvider(
    primary,
    () => primary.getGlobalData(currency),
    () => fallback.getGlobalData(currency),
  )
}

export async function getExchangesPaginated(perPage = 50, page = 1): Promise<{ data: ExchangeSummary[]; total_count: number }> {
  const result = await tryProvider(
    primary,
    () => primary.getExchangesPaginated(perPage, page),
    () => fallback.getExchangesPaginated(perPage, page),
  )
  return result ?? { data: [], total_count: 0 }
}

export async function getExchangeDetail(slug: string): Promise<ExchangeDetail | null> {
  return tryProvider(
    primary,
    () => primary.getExchangeDetail(slug),
    () => fallback.getExchangeDetail(slug),
  )
}

export async function getExchangeMarkets(slug: string, perPage = 50): Promise<ExchangeMarketPair[]> {
  const result = await tryProvider(
    primary,
    () => primary.getExchangeMarkets(slug, perPage),
    () => fallback.getExchangeMarkets(slug, perPage),
  )
  return result ?? []
}

// Legacy alias — returns first N exchanges as simple list (for static params)
export async function getExchangeList(limit = 30): Promise<{ id: string; name: string }[]> {
  const result = await tryProvider(
    primary,
    () => primary.getExchangesPaginated(limit),
    () => fallback.getExchangesPaginated(limit),
  )
  const data = result ?? { data: [], total_count: 0 }
  return data.data.slice(0, limit).map(e => ({ id: e.id, name: e.name }))
}

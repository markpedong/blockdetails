// CoinMarketCap free-tier fallback provider.
// Uses trial endpoints that don't require an API key for basic listing/quotes.

import type { CryptoProvider, PaginatedResult } from '../provider'
import type { Coin, CoinDetail, MarketChartPoint, GlobalMarketData, TrendingCoin, ExchangeSummary, ExchangeDetail, ExchangeMarketPair } from '../types'

const CMC_BASE = 'https://pro-api.coinmarketcap.com'

// Map CG paths → CMC free-tier equivalents
const PATH_MAP: Record<string, string | null> = {
  '/coins/markets': '/trial-pro-api/v1/cryptocurrency/listings/latest',
}

// Single-coin CG path → CMC convert endpoint (requires hardcoded IDs)
const SINGLE_MAP: Record<string, { cmcId: number; path: string }> = {
  'bitcoin': { cmcId: 1, path: '/trial-pro-api/v3/cryptocurrency/quotes/latest?ids=1&convert=USD' },
  'ethereum': { cmcId: 1027, path: '/trial-pro-api/v3/cryptocurrency/quotes/latest?ids=1027&convert=USD' },
}

function mapCoinFromCMC(raw: Record<string, unknown>, currency = 'usd'): Coin {
  const quote = (raw.quote as Record<string, unknown>)?.[currency.toUpperCase()] as Record<string, number> | undefined
  const supply = raw.max_supply ?? raw.total_supply ?? raw.circulating_supply
  return {
    id: (raw.slug as string) ?? '',
    symbol: (raw.symbol as string) ?? '',
    name: (raw.name as string) ?? '',
    image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${raw.id}.png`,
    market_cap_rank: (raw.cmc_rank as number) ?? null,
    current_price: quote?.price ?? null,
    price_change_percentage_1h_in_currency: quote?.price_change_percentage_1h ?? null,
    price_change_percentage_24h: quote?.price_change_percentage_24h ?? null,
    price_change_percentage_7d_in_currency: quote?.price_change_percentage_7d ?? null,
    price_change_percentage_30d_in_currency: quote?.price_change_percentage_30d ?? null,
    price_change_percentage_60d_in_currency: quote?.price_change_percentage_60d ?? null,
    price_change_percentage_1y_in_currency: quote?.price_change_percentage_1y ?? null,
    market_cap: quote?.market_cap ?? null,
    total_volume: quote?.volume_24h ?? null,
    high_24h: quote?.high_24h ?? null,
    low_24h: quote?.low_24h ?? null,
    circulating_supply: (raw.circulating_supply as number) ?? null,
    total_supply: (supply as number | undefined) ?? null,
    max_supply: (raw.max_supply as number | undefined) ?? null,
    ath: quote?.ath ?? null,
    ath_date: (raw.ath_date as string | undefined) ?? null,
    ath_change_percentage: quote?.ath_change_percentage ?? null,
    atl: quote?.atl ?? null,
    atl_date: (raw.atl_date as string | undefined) ?? null,
    last_updated: (raw.last_updated as string) ?? '',
  }
}

export class CoinMarketCapProvider implements CryptoProvider {
  name = 'coinmarketcap'

  private async _fetch(path: string): Promise<unknown | null> {
    const mapped = PATH_MAP[path]
    if (!mapped) return null

    try {
      const url = `${CMC_BASE}${mapped}`
      const res = await fetch(url, { signal: AbortSignal.timeout(8_000) })
      if (!res.ok) return null
      const data = await res.json()
      if (mapped.includes('/cryptocurrency/listings') && data.data) {
        return data.data as Array<Record<string, unknown>>
      }
    } catch { /* ignore */ }
    return null
  }

  private async _fetchSingle(slug: string): Promise<Record<string, unknown> | null> {
    const mapped = SINGLE_MAP[slug]
    if (!mapped) return null

    try {
      const url = `${CMC_BASE}${mapped.path}`
      const res = await fetch(url, { signal: AbortSignal.timeout(8_000) })
      if (!res.ok) return null
      const data = await res.json()
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        return data.data[0] as Record<string, unknown>
      }
    } catch { /* ignore */ }
    return null
  }

  async getCoinsList(): Promise<Pick<Coin, 'id' | 'symbol' | 'name'>[]> {
    const data = await this._fetch('/coins/markets')
    if (!data) return []
    const coins = data as Array<Record<string, unknown>>
    return coins.map(c => ({ id: (c.slug as string) ?? '', symbol: (c.symbol as string) ?? '', name: (c.name as string) ?? '' }))
  }

  async getCoinsPaginated(currency: string): Promise<PaginatedResult<Coin>> {
    const data = await this._fetch('/coins/markets')
    if (!data) return { data: [], total_count: 0 }
    const coins = data as Array<Record<string, unknown>>
    return { data: coins.map(c => mapCoinFromCMC(c, currency)), total_count: coins.length }
  }

  async getCoinDetail(slug: string, currency = 'usd'): Promise<CoinDetail | null> {
    // CMC free tier doesn't provide full coin detail — return null to signal fallback should try another provider
    const raw = await this._fetchSingle(slug)
    if (!raw) return null

    const quote = (raw.quote as Record<string, unknown>)?.[currency.toUpperCase()] as Record<string, number> | undefined
    const supply = raw.max_supply ?? raw.total_supply ?? raw.circulating_supply

    // Build a minimal CoinDetail from CMC data
    return {
      id: (raw.slug as string) ?? '',
      symbol: (raw.symbol as string) ?? '',
      name: (raw.name as string) ?? '',
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${raw.id}.png`,
      market_cap_rank: (raw.cmc_rank as number) ?? null,
      current_price: quote?.price ?? null,
      price_change_percentage_1h_in_currency: quote?.price_change_percentage_1h ?? null,
      price_change_percentage_24h: quote?.price_change_percentage_24h ?? null,
      price_change_percentage_7d_in_currency: quote?.price_change_percentage_7d ?? null,
      price_change_percentage_30d_in_currency: quote?.price_change_percentage_30d ?? null,
      price_change_percentage_60d_in_currency: quote?.price_change_percentage_60d ?? null,
      price_change_percentage_1y_in_currency: quote?.price_change_percentage_1y ?? null,
      market_cap: quote?.market_cap ?? null,
      total_volume: quote?.volume_24h ?? null,
      high_24h: quote?.high_24h ?? null,
      low_24h: quote?.low_24h ?? null,
      circulating_supply: (raw.circulating_supply as number) ?? null,
      total_supply: (supply as number | undefined) ?? null,
      max_supply: (raw.max_supply as number | undefined) ?? null,
      ath: quote?.ath ?? null,
      ath_date: (raw.ath_date as string | undefined) ?? null,
      ath_change_percentage: quote?.ath_change_percentage ?? null,
      atl: quote?.atl ?? null,
      atl_date: (raw.atl_date as string | undefined) ?? null,
      last_updated: (raw.last_updated as string) ?? '',
      description: '',
      homepage: [],
      blockchain_site: [],
      official_forum_url: [],
      chat_urls: [],
      announcement_urls: [],
      subreddit_url: [],
      repos_url: {},
    } as CoinDetail
  }

  async getMarketChart(_slug?: string, _currency?: string, _days?: number): Promise<MarketChartPoint[]> {
    // CMC free tier doesn't provide chart data — return empty (no fallback possible)
    return []
  }

  async getTrending(): Promise<TrendingCoin[]> {
    // CMC free tier doesn't provide trending
    return []
  }

  async searchCoins(_query?: string, _currency?: string): Promise<Pick<Coin, 'id' | 'symbol' | 'name' | 'market_cap_rank' | 'image'>[]> {
    // CMC free tier doesn't provide search
    return []
  }

  async getGlobalData(_currency?: string): Promise<GlobalMarketData | null> {
    // CMC free tier doesn't provide global data
    return null
  }

  async getExchangesPaginated(_perPage?: number, _page?: number): Promise<PaginatedResult<ExchangeSummary>> {
    // CMC free tier doesn't provide exchange data
    return { data: [], total_count: 0 }
  }

  async getExchangeDetail(_slug?: string): Promise<ExchangeDetail | null> {
    return null
  }

  async getExchangeMarkets(_slug?: string, _perPage?: number): Promise<ExchangeMarketPair[]> {
    return []
  }
}

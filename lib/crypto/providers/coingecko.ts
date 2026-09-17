import type { CryptoProvider, PaginatedResult } from '../provider'
import type { Coin, CoinDetail, MarketChartPoint, GlobalMarketData, TrendingCoin, ExchangeSummary, ExchangeDetail, ExchangeMarketPair } from '../types'

const BASE_URL = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3'
const API_KEY = process.env.COINGECKO_API_KEY

function buildUrl(path: string, params?: URLSearchParams): string {
  const url = new URL(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, BASE_URL)
  if (params) url.search = params.toString()
  return url.toString()
}

function fetchJSON(url: string, options?: RequestInit): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (API_KEY) headers['x-cg-pro-api-key'] = API_KEY
  return fetch(url, { ...options, headers }).then(r => {
    if (!r.ok) throw Object.assign(new Error(`${r.status} ${r.statusText}`), { status: r.status })
    return r.json()
  })
}

function timeout(ms: number): AbortSignal {
  return AbortSignal.timeout(ms)
}

// ── CoinGecko → internal type mappers ────────────────────────

function mapCoin(raw: Record<string, unknown>, currency: string): Coin {
  const md = raw.market_data as Record<string, unknown> | null
  const price = (md?.current_price as Record<string, number | null>)?.[currency] ?? null
  const vol = (md?.total_volume as Record<string, number>)?.[currency] ?? null
  const mc = (md?.market_cap as Record<string, number>)?.[currency] ?? null
  const h24 = (md?.high_24h as Record<string, number>)?.[currency] ?? null
  const l24 = (md?.low_24h as Record<string, number>)?.[currency] ?? null
  const ath = (md?.ath as Record<string, number>)?.[currency] ?? null
  const athPct = (md?.ath_change_percentage as Record<string, number>)?.[currency] ?? null
  const atl = (md?.atl as Record<string, number>)?.[currency] ?? null
  const athDate = (md?.ath_date as Record<string, string | null>)?.[currency] ?? null
  const atlDate = (md?.atl_date as Record<string, string | null>)?.[currency] ?? null
  const fdv = (md?.fully_diluated_valuation as number | null) ?? (md?.fully_diluted_valuation as number | null) ?? null

  const pct = (k: string) => {
    const obj = md?.[k] as Record<string, number | null> | undefined
    return obj?.[currency] ?? null
  }

  const img = raw.image as Record<string, string> | undefined
  return {
    id: (raw.id as string) ?? '',
    symbol: (raw.symbol as string) ?? '',
    name: (raw.name as string) ?? '',
    image: img?.large ?? img?.thumb ?? null,
    market_cap_rank: (raw.market_cap_rank as number) ?? null,
    current_price: price,
    price_change_percentage_1h_in_currency: pct('price_change_percentage_1h_in_currency'),
    price_change_percentage_24h: pct('price_change_percentage_24h'),
    price_change_percentage_7d_in_currency: pct('price_change_percentage_7d_in_currency'),
    price_change_percentage_30d_in_currency: pct('price_change_percentage_30d_in_currency'),
    price_change_percentage_60d_in_currency: pct('price_change_percentage_60d_in_currency'),
    price_change_percentage_1y_in_currency: pct('price_change_percentage_1y_in_currency'),
    market_cap: mc,
    total_volume: vol,
    high_24h: h24,
    low_24h: l24,
    circulating_supply: (raw.circulating_supply as number) ?? null,
    total_supply: (raw.total_supply as number | undefined) ?? null,
    max_supply: (raw.max_supply as number | undefined) ?? null,
    ath,
    ath_date: athDate,
    ath_change_percentage: athPct,
    atl,
    atl_date: atlDate,
    last_updated: (raw.last_updated as string) ?? '',
  }
}

function mapCoinDetail(raw: Record<string, unknown>, currency: string): CoinDetail {
  const coin = mapCoin(raw, currency) as Omit<CoinDetail, 'description' | 'homepage' | 'blockchain_site' | 'official_forum_url' | 'chat_urls' | 'announcement_urls' | 'subreddit_url' | 'repos_url' | 'categories'>
  const md = raw.market_data as Record<string, unknown> | null

  return {
    ...coin,
    description: (raw.description as Record<string, string>)?.en ?? '',
    homepage: (raw.links as Record<string, unknown>)?.website as string[] | undefined ?? [],
    blockchain_site: (raw.links as Record<string, unknown>)?.blockchain_site as string[] | undefined ?? [],
    official_forum_url: (raw.links as Record<string, unknown>)?.official_forum_url as string[] | undefined ?? [],
    chat_urls: (raw.links as Record<string, unknown>)?.chat_urls as string[] | undefined ?? [],
    announcement_urls: (raw.links as Record<string, unknown>)?.announcement_url as string[] | undefined ?? [],
    subreddit_url: (raw.links as Record<string, unknown>)?.subreddit_url as string[] | undefined ?? [],
    repos_url: ((raw.links as Record<string, unknown>)?.repos_url as Record<string, string>) ?? {},
    categories: raw.categories as string[] | undefined,
    platform_id: (raw.platform as string) ?? coin.platform_id,
    fully_diluted_valuation: (md?.fully_diluted_valuation as number | null) ?? coin.fully_diluted_valuation,
  }
}

function mapChart(raw: Record<string, unknown>): MarketChartPoint[] {
  const prices = raw.prices as [number, number][] | undefined
  if (!prices) return []
  return prices.map(([ts, price]) => ({ timestamp: ts, price }))
}

function mapGlobal(raw: Record<string, unknown>, currency: string): GlobalMarketData {
  const tmc = raw.total_market_cap as Record<string, number> | undefined
  const tv = raw.total_volume as Record<string, number> | undefined
  return {
    total_market_cap_usd: currency ? tmc?.[currency] ?? null : (tmc?.usd ?? null),
    total_volume_usd: currency ? tv?.[currency] ?? null : (tv?.usd ?? null),
    btc_dominance: (raw.btc_dominance as number) ?? null,
    eth_dominance: (raw.eth_dominance as number | undefined) ?? null,
    market_cap_change_percentage_24h_usd: (raw.market_cap_change_percentage_24h_usd as number | undefined) ?? null,
    active_cryptocurrencies: (raw.active_cryptocurrencies as number | undefined) ?? null,
    total_updates: (raw.total_updates as number | undefined) ?? null,
  }
}

function mapTrending(raw: Record<string, unknown>): TrendingCoin[] {
  const coins = (raw.coins as Array<{ item: Record<string, unknown> }>) ?? []
  return coins.map(c => {
    const item = c.item
    const img = (item.image as Record<string, string>) ?? {}
    return {
      id: (item.id as string) ?? '',
      name: (item.name as string) ?? '',
      symbol: (item.symbol as string) ?? '',
      market_cap_rank: (item.market_cap_rank as number) ?? 0,
      image: img.thumb ?? '',
    }
  })
}

function mapExchangeSummary(raw: Record<string, unknown>): ExchangeSummary {
  const tv = (raw.total_volume as Record<string, number>) ?? {}
  const img = (raw.image as Record<string, string>) ?? {}
  return {
    id: (raw.id as string) ?? '',
    name: (raw.name as string) ?? '',
    image: img.large ?? null,
    trust_score: (raw.trust_score as string) ?? String((raw.trust_score as number) ?? 0),
    markets: (raw.markets as number | undefined) ?? null,
    total_24h_volume_usd: tv.usd ?? null,
  }
}

function mapExchangeDetail(raw: Record<string, unknown>): ExchangeDetail {
  const tv = (raw.total_volume as Record<string, number>) ?? {}
  const img = (raw.image as Record<string, string>) ?? {}
  return {
    id: (raw.id as string) ?? '',
    name: (raw.name as string) ?? '',
    image: img.large ?? null,
    trust_score: (raw.trust_score as string) ?? String((raw.trust_score as number) ?? 0),
    established: (raw.established as number | undefined) ?? null,
    markets: (raw.markets as number | undefined) ?? null,
    total_24h_volume_usd: tv.usd ?? null,
    reported_volume_24h_usd: (raw.reported_volume_24h_usd as number | undefined) ?? null,
    trading_volume_score: (raw.trading_volume_score as number | undefined) ?? null,
    description: (raw.description as Record<string, string>)?.en,
    homepage: (raw.links as Record<string, unknown>)?.website as string[] | undefined ?? [],
    blockchain_site: (raw.links as Record<string, unknown>)?.blockchain_site as string[] | undefined ?? [],
    url: (raw.url as string) ?? undefined,
    twitter_username: (raw.twitter_username as string) ?? undefined,
  }
}

function mapExchangeMarket(raw: Record<string, unknown>): ExchangeMarketPair {
  const tv = (raw.last_trade_at ? {} : {}) as Record<string, unknown> // placeholder
  const vol = (raw.total_volume as Record<string, number>) ?? {}
  return {
    base: (raw.base ?? '') as string,
    quote: (raw.quote ?? '') as string,
    last_price: (raw.last as number | undefined) ?? null,
    volume_24h_usd: vol.usd ?? null,
    trust_score: (raw.trust_score as string | number | undefined) != null ? String(raw.trust_score) : null,
  }
}

// ── Provider implementation ──────────────────────────────────

export class CoinGeckoProvider implements CryptoProvider {
  name = 'coingecko'

  private async _fetch(path: string, params?: URLSearchParams, cache?: 'force-cache' | 'no-store', revalidate?: number): Promise<unknown> {
    const url = buildUrl(path, params)
    return fetchJSON(url, {
      cache: cache ?? 'force-cache',
      next: revalidate != null ? { revalidate } : undefined,
      signal: timeout(8_000),
    }) as Promise<unknown>
  }

  async getCoinsList(currency?: string): Promise<Pick<Coin, 'id' | 'symbol' | 'name'>[]> {
    const data = await this._fetch('/coins/list', new URLSearchParams({ include_platform: 'false' }), 'force-cache', 86400)
    return ((data as Array<Record<string, unknown>>) ?? []).map(c => ({
      id: (c.id as string) ?? '',
      symbol: (c.symbol as string) ?? '',
      name: (c.name as string) ?? '',
    }))
  }

  async getCoinsPaginated(currency: string, order?: string, perPage = 50, page = 1): Promise<PaginatedResult<Coin>> {
    const qs = new URLSearchParams({ vs_currency: currency, order: order ?? 'market_cap_desc', per_page: String(perPage), page: String(page), sparkline: 'false' })
    const data = await this._fetch('/coins/markets', qs, 'no-store')
    const coins = (data as Array<Record<string, unknown>>) ?? []
    return { data: coins.map(c => mapCoin(c, currency)), total_count: coins.length }
  }

  async getCoinDetail(slug: string, currency = 'usd'): Promise<CoinDetail | null> {
    const qs = new URLSearchParams({ localization: 'false', tickers: 'false', market_data: 'true', community_data: 'false', developer_data: 'false' })
    const raw = await this._fetch(`/coins/${slug}`, qs, 'no-store')
    if (!raw || typeof raw !== 'object') return null
    return mapCoinDetail(raw as Record<string, unknown>, currency)
  }

  async getMarketChart(slug: string, currency = 'usd', days = 1): Promise<MarketChartPoint[]> {
    const qs = new URLSearchParams({ vs_currency: currency, days: String(days) })
    const raw = await this._fetch(`/coins/${slug}/market_chart`, qs, 'no-store')
    return mapChart(raw as Record<string, unknown>)
  }

  async getTrending(): Promise<TrendingCoin[]> {
    const raw = await this._fetch('/search/trending', undefined, 'force-cache', 300)
    return mapTrending(raw as Record<string, unknown>)
  }

  async searchCoins(query: string, currency = 'usd'): Promise<Pick<Coin, 'id' | 'symbol' | 'name' | 'market_cap_rank' | 'image'>[]> {
    const qs = new URLSearchParams({ query })
    const raw = await this._fetch('/coins/search', qs, 'no-store')
    const coins = (raw as { coins?: Array<Record<string, unknown>> })?.coins ?? []
    return (coins as Array<Record<string, unknown>>).map(c => ({
      id: (c.id as string) ?? '',
      symbol: (c.symbol as string) ?? '',
      name: (c.name as string) ?? '',
      market_cap_rank: (c.market_cap_rank as number) ?? null,
      image: (c.image as Record<string, string>)?.thumb ?? '',
    }))
  }

  async getGlobalData(currency = 'usd'): Promise<GlobalMarketData | null> {
    const qs = new URLSearchParams({ localization: 'false' })
    const raw = await this._fetch('/global', qs, 'force-cache', 60)
    if (!raw || typeof raw !== 'object') return null
    return mapGlobal(raw as Record<string, unknown>, currency)
  }

  async getExchangesPaginated(perPage = 50, page = 1): Promise<PaginatedResult<ExchangeSummary>> {
    const qs = new URLSearchParams({ order: 'volume_24h_usd_desc', per_page: String(perPage), page: String(page) })
    const data = await this._fetch('/exchanges', qs, 'force-cache', 300)
    const exchanges = (data as Array<Record<string, unknown>>) ?? []
    return { data: exchanges.map(e => mapExchangeSummary(e)), total_count: exchanges.length }
  }

  async getExchangeDetail(slug: string): Promise<ExchangeDetail | null> {
    const raw = await this._fetch(`/exchanges/${slug}`, undefined, 'force-cache', 600)
    if (!raw || typeof raw !== 'object') return null
    return mapExchangeDetail(raw as Record<string, unknown>)
  }

  async getExchangeMarkets(slug: string, perPage = 50): Promise<ExchangeMarketPair[]> {
    const qs = new URLSearchParams({ per_page: String(perPage) })
    const data = await this._fetch(`/exchanges/${slug}/markets`, qs, 'no-store')
    const markets = (data as Array<Record<string, unknown>>) ?? []
    return markets.map(m => mapExchangeMarket(m))
  }
}

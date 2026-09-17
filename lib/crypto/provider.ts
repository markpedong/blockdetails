// Provider interface — every provider adapter implements this.

import type { Coin, CoinDetail, MarketChartPoint, GlobalMarketData, TrendingCoin, ExchangeSummary, ExchangeDetail, ExchangeMarketPair } from './types'

export interface CryptoProvider {
  name: string

  // Coins
  getCoinsList(currency?: string): Promise<Pick<Coin, 'id' | 'symbol' | 'name'>[]>
  getCoinsPaginated(currency: string, order?: string, perPage?: number, page?: number): Promise<PaginatedResult<Coin>>
  getCoinDetail(slug: string, currency?: string): Promise<CoinDetail | null>
  getMarketChart(slug: string, currency: string, days: number): Promise<MarketChartPoint[]>
  getTrending(): Promise<TrendingCoin[]>
  searchCoins(query: string, currency?: string): Promise<Pick<Coin, 'id' | 'symbol' | 'name' | 'market_cap_rank' | 'image'>[]>

  // Global
  getGlobalData(currency: string): Promise<GlobalMarketData | null>

  // Exchanges
  getExchangesPaginated(perPage?: number, page?: number): Promise<PaginatedResult<ExchangeSummary>>
  getExchangeDetail(slug: string): Promise<ExchangeDetail | null>
  getExchangeMarkets(slug: string, perPage?: number): Promise<ExchangeMarketPair[]>
}

export interface PaginatedResult<T> {
  data: T[]
  total_count: number
}

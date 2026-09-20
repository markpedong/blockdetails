export type Provider = 'coingecko' | 'coinmarketcap'

/** Missing provider fields are null, never invented zeroes or USD substitutes. */
export interface Coin {
  id: string
  slug: string
  coingecko_id: string | null
  coinmarketcap_id: number | null
  symbol: string
  name: string
  image: string | null
  market_cap_rank: number | null
  current_price: number | null
  price_change_percentage_1h_in_currency: number | null
  price_change_percentage_24h: number | null
  price_change_percentage_7d_in_currency: number | null
  price_change_percentage_30d_in_currency: number | null
  price_change_percentage_60d_in_currency: number | null
  price_change_percentage_1y_in_currency: number | null
  market_cap: number | null
  total_volume: number | null
  fully_diluted_valuation: number | null
  high_24h: number | null
  low_24h: number | null
  price_change_24h: number | null
  circulating_supply: number | null
  total_supply: number | null
  max_supply: number | null
  ath: number | null
  ath_change_percentage: number | null
  ath_date: string | null
  atl: number | null
  atl_date: string | null
  last_updated: string | null
  description: string
  links: { label: string; url: string }[]
  platforms: Record<string, string>
  categories: string[]
  provider: Provider
}
export type CoinDetail = Coin
export type SearchCoin = Pick<Coin, 'id' | 'symbol' | 'name' | 'image' | 'market_cap_rank'>
export type MarketOrder = 'market_cap_desc' | 'market_cap_asc' | 'volume_desc' | 'volume_asc' | 'id_asc' | 'id_desc'
export interface MarketsOptions {
  currency?: string
  page?: number
  perPage?: number
  order?: MarketOrder | string
  ids?: string[]
  category?: string
}
export interface ChartData { prices: [number, number][] }
/** Currency dictionaries preserve the existing market-overview contract. */
export interface GlobalMarketData {
  total_market_cap: Record<string, number | null>
  total_volume: Record<string, number | null>
  market_cap_percentage: Record<string, number | null>
  active_cryptocurrencies: number | null
  market_cap_change_percentage_24h_usd: number | null
  provider: Provider
}
export interface Exchange {
  id: string
  name: string
  image: string | null
  trust_score: number | null
  trust_score_rank: number | null
  trade_volume_24h_btc: number | null
  coins: number | null
  pairs: number | null
  year_established: number | null
  country: string | null
  description: string
  url: string | null
  market_center_url: string | null
  provider: Provider
}
export interface MarketPair {
  market_id: string
  market_name: string
  base: string
  quote: string
  base_symbol: string
  quote_symbol: string
  last_price: number | null
  volume_24h_usd: number | null
  volume_btc_24h: number | null
  trust_score: string | null
  trade_url: string | null
}
export interface ExchangeDetail { exchange: Exchange; pairs: MarketPair[] }
export interface Category { id: string; name: string }
export interface CryptoClient {
  getMarkets(options?: MarketsOptions): Promise<Coin[]>
  getCoin(id: string, currency?: string): Promise<Coin>
  getChart(id: string, currency?: string, days?: number): Promise<ChartData>
  getGlobal(currency?: string): Promise<GlobalMarketData>
  getTrending(currency?: string): Promise<Coin[]>
  searchCoins(query: string): Promise<SearchCoin[]>
  getExchanges(page?: number, perPage?: number): Promise<Exchange[]>
  getExchange(id: string): Promise<ExchangeDetail>
  getExchangeMarkets(id: string, page?: number): Promise<MarketPair[]>
  getCoinMarkets(id: string, page?: number): Promise<MarketPair[]>
  getCategories(): Promise<Category[]>
}

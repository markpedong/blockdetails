// Canonical internal types — the frontend depends ONLY on these.

export interface Coin {
  id: string
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
  high_24h: number | null
  low_24h: number | null
  circulating_supply: number | null
  total_supply: number | null
  max_supply: number | null
  ath: number | null
  ath_date: string | null
  ath_change_percentage: number | null
  atl: number | null
  atl_date: string | null
  last_updated: string | null
}

export interface CoinDetail extends Coin {
  description: string
  homepage: string[]
  blockchain_site: string[]
  official_forum_url: string[]
  chat_urls: string[]
  announcement_urls: string[]
  subreddit_url: string[]
  repos_url: Record<string, string>
  categories?: string[]
  platform_id?: string
  fully_diluted_valuation?: number | null
}

export interface MarketChartPoint {
  timestamp: number
  price: number
}

export interface GlobalMarketData {
  total_market_cap_usd: number | null
  total_volume_usd: number | null
  btc_dominance: number | null
  eth_dominance: number | null
  market_cap_change_percentage_24h_usd: number | null
  active_cryptocurrencies: number | null
  total_updates: number | null
}

export interface TrendingCoin {
  id: string
  name: string
  symbol: string
  market_cap_rank: number
  image: string
}

export interface ExchangeSummary {
  id: string
  name: string
  image: string | null
  trust_score: string | null
  markets?: number | null
  total_24h_volume_usd: number | null
}

export interface ExchangeDetail {
  id: string
  name: string
  image: string | null
  trust_score: string | null
  established: number | null
  markets?: number | null
  total_24h_volume_usd: number | null
  reported_volume_24h_usd: number | null
  trading_volume_score: number | null
  description?: string
  homepage?: string[]
  blockchain_site?: string[]
  url?: string
  twitter_username?: string
}

export interface ExchangeMarketPair {
  base: string
  quote: string
  last_price?: number | null
  volume_24h_usd?: number | null
  trust_score?: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total_count: number
  page: number
  per_page: number
  total_pages: number
}

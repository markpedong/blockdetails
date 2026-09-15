import { fetchCG } from './api'

// ── Types ──────────────────────────────────────────────

export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number | null
  market_cap: number | null
  market_cap_rank: number | null
  total_volume: number | null
  high_24h?: number | null
  low_24h?: number | null
  price_change_percentage_24h?: number | null
  price_change_percentage_1h_in_currency?: number | null
  price_change_percentage_7d_in_currency?: number | null
  circulating_supply: number | null
  total_supply?: number | null
  max_supply?: number | null
  ath: number | null
  platform_id?: string
  ath_date?: string
  atl: number | null
  atl_date?: string
}

export interface CoinDetail extends Coin {
  market_data: {
    current_price: Record<string, number | null>
    ath: Record<string, number | null>
    ath_change_percentage: Record<string, number | null>
    ath_date: Record<string, string | null>
    atl: Record<string, number | null>
    atl_change_percentage: Record<string, number | null>
    atl_date: Record<string, string | null>
    price_change_24h?: number | null
    price_change_percentage_1h_in_currency?: Record<string, number | null>
    price_change_percentage_24h_in_currency?: Record<string, number | null>
    price_change_percentage_7d_in_currency?: Record<string, number | null>
    price_change_percentage_30d_in_currency?: Record<string, number | null>
    price_change_percentage_60d_in_currency?: Record<string, number | null>
    price_change_percentage_1y_in_currency?: Record<string, number | null>
    price_change_percentage_1y: number
    market_cap_change_24h?: number | null
    market_cap_change_percentage_24h?: number | null
    total_volume: Record<string, number | null>
    max_supply?: number | null
    fully_diluted_valuation?: number | null
  }
  description: { en: string }
  links: {
    website?: string[]
    blockchain_site?: string[]
    official_forum_url?: string[]
    chat_urls?: string[]
    announcement_url?: string[]
    subreddit_url?: string[]
    repos_url: Record<string, string | null>
  }
  categories?: string[]
}

export interface MarketChart {
  prices: [number, number][]
}

export interface GlobalData {
  total_market_cap: Record<string, number>
  total_volume?: Record<string, number>
  btc_dominance: number
  eth_dominance?: number
  market_cap_change_percentage_24h_usd?: number
  active_cryptocurrencies?: number
  total_updates?: number
}

export interface TrendingCoin {
  id: string
  coin_id: number
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  small: string
  large: string
  price_btc: number
  score: number
}

// ── API functions ───────────────────────────────────────

export async function getCoins(params: {
  vs_currency?: string
  order?: string
  per_page?: number
  page?: number
  sparkline?: boolean
  price_change_percentage?: string
}): Promise<Coin[]> {
  const qs = new URLSearchParams()
  if (params.vs_currency) qs.set('vs_currency', params.vs_currency)
  if (params.order) qs.set('order', params.order)
  if (params.per_page) qs.set('per_page', String(params.per_page))
  if (params.page) qs.set('page', String(params.page))
  if (params.sparkline != null) qs.set('sparkline', params.sparkline ? 'true' : 'false')
  if (params.price_change_percentage) qs.set('price_change_percentage', params.price_change_percentage)
  const path = `/coins/markets?${qs}`
  return fetchCG(path, { cache: 'force-cache', revalidate: 60 }) as unknown as Promise<Coin[]>
}

export async function getCoinDetail(coinId: string): Promise<CoinDetail> {
  return fetchCG(`/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`, {
    revalidate: 300
  }) as unknown as Promise<CoinDetail>
}

export async function getMarketChart(coinId: string, currency = 'usd', days = 1): Promise<MarketChart> {
  return fetchCG(`/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`, {
    revalidate: 60
  }) as unknown as Promise<MarketChart>
}

export async function getGlobalData(): Promise<GlobalData> {
  return fetchCG('/global_data', { revalidate: 60 }) as unknown as Promise<GlobalData>
}

export async function getTrending(): Promise<TrendingCoin[]> {
  const data = (await fetchCG('/search/trending', { revalidate: 300 })) as { coins: Array<{ item: TrendingCoin }> }
  return data.coins.map(c => c.item) as unknown as TrendingCoin[]
}

export async function searchCoins(query: string): Promise<Coin[]> {
  const data = (await fetchCG(`/coins/search?query=${encodeURIComponent(query)}`, { revalidate: 0 })) as {
    coins: Pick<Coin, 'id' | 'name' | 'symbol' | 'market_cap_rank' | 'image'>[]
  }
  return data.coins as unknown as Coin[]
}

export async function getCoinsList(): Promise<{ id: string; symbol: string; name: string }[]> {
  return fetchCG('/coins/list?include_platform=false', { revalidate: 86400 }) as unknown as Promise<
    { id: string; symbol: string; name: string }[]
  >
}

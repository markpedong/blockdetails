import { get } from './http'

const HOST_CG = process.env.HOST_CG
const HOST_CMC = process.env.HOST_CMC_PROD
const HOST_PAP = process.env.HOST_PAP

// //cryptocurrency/map
export type CoinIds = {
	id: number
	name: string
	symbol: string
	slug: string
}

export const getCoinIds = params => get<CoinIds[]>(`${HOST_CMC}/v1/cryptocurrency/map`, params)

// /v1/global-metrics/quotes/latest
export type GlobalData = {
	active_cryptocurrencies: number
	active_exchanges: number
	btc_dominance: number
	btc_dominance_24h_percentage_change: number
	defi_volume_24h_reported: number
	defi_24h_percentage_change: number
	eth_dominance: number
	eth_dominance_24h_percentage_change: number
	quote: {
		[currency: string]: {
			total_market_cap: number
			total_market_cap_yesterday_percentage_change: number
			total_volume_24h: number
			total_volume_24h_yesterday_percentage_change: number
		}
	}
}

export const getGlobalCrypto = params => get<GlobalData>(`${HOST_CMC}/v1/global-metrics/quotes/latest`, params)

// /v1/cryptocurrency/listings/latest
export type Cryptocurrency = {
	cmc_rank: number
	circulating_supply: number
	id: number
	image: string
	max_supply: number
	name: string
	quote: {
		[currency: string]: {
			price: number
			volume_24h: number
			percent_change_1h: number
			percent_change_24h: number
			percent_change_7d: number
			market_cap: number
		}
	}
	slug: string
	symbol: string
	sparkline_in_7d: { price: number[] }
	total_supply: number
}

export const getCryptocurrency = (params: any = {}) =>
	get<Cryptocurrency[]>(`${HOST_CMC}/v1/cryptocurrency/listings/latest`, params)

// /v3/global/decentralized_finance_defi
export type DefiData = {
	data: {
		defi_market_cap: string
		eth_market_cap: string
		defi_to_eth_ratio: string
		trading_volume_24h: string
		defi_dominance: string
		top_coin_name: string
		top_coin_defi_dominance: number
	}
}
export const getDefi = () => get(`${HOST_CG}/global/decentralized_finance_defi`, {}, false)

// /v1/fiat/map
export type Fiat = {
	id: number
	name: string
	sign: string
	symbol: string
}

export const getFiats = () => get<Fiat[]>(`${HOST_CMC}/v1/fiat/map`)

// /v3/exchanges
export type TExchange = {
	country: string
	description: string
	id: string
	image: string
	name: string
	markets: number
	sessions_per_month: number
	trade_volume_24h_btc_normalized: number
	trade_volume_24h_btc: number
	trust_score_rank: number
	trust_score: number
	url: string
	year_established: number
}

export const getExchanges = params => get<TExchange[]>(`${HOST_CG}/exchanges`, params, false)

// /v1/exchanges
export type ExchangePap = {
	id: string
	name: string
	currencies: number
	confidence_score: number
	description: string
	markets: number
	quotes: {
		[currency: string]: {
			reported_volume_30d: number
			reported_volume_24h: number
		}
	}
	fiats: {
		name: string
		symbol: string
	}[]
	reported_rank: number
}

export const getExchangesPaprika = params => get<ExchangePap>(`${HOST_PAP}/v1/exchanges`, params)

// /coins/list
export type CGCoinData = {
	id: string
	image: string
	name: string
	price_change_percentage_24h: number
	current_price: number
	total_volume: number
	symbol: string
}
export const getCoinList = params => get(`${HOST_CG}/coins/markets`, params, false)

// /v2/cryptocurrency/info
export type CoinData = {
	category: string
	description: string
	id: string
	logo: string
	name: string
	slug: string
	symbol: string
	urls: {
		explorer: string[]
		website: string[]
		message_board: string[]
		reddit: string[]
		source_code: string[]
	}
}

export const getDetail = params => get<CoinData>(`${HOST_CMC}/v2/cryptocurrency/info`, params)

// v2/cryptocurrency/quotes/latest
export type QuoteData = {
	cmc_rank: string
	circulating_supply: number
	max_supply: number
	total_supply: number
	quote: {
		[currency: string]: {
			fully_diluted_market_cap: number
			price: number
			volume_24h: number
			percent_change_1h: number
			percent_change_24h: number
			percent_change_7d: number
			percent_change_30d: number
			percent_change_60d: number
			market_cap: number
		}
	}
}

export const getQuotesLatest = params => get<QuoteData>(`${HOST_CMC}/v2/cryptocurrency/quotes/latest`, params)

// /v3/coins/bitcoin/market_chart
export type MarketChartRes = {
	prices: number[][]
}
export const getMarketChart = (slug, params) =>
	get<MarketChartRes>(`${HOST_CG}/coins/${slug}/market_chart`, params, false)

// /api/v3/coins/
export type CoinDataCG = {
	id: string
	market_data: {
		current_price: {
			[currency: string]: number
		}
		ath: {
			[currency: string]: number
		}
		ath_change_percentage: {
			[currency: string]: number
		}
		ath_date: {
			[currency: string]: string
		}
		atl: {
			[currency: string]: number
		}
		atl_change_percentage: {
			[currency: string]: number
		}
		atl_date: {
			[currency: string]: string
		}
		price_change_24h_in_currency: {
			[currency: string]: number
		}
		price_change_percentage_7d_in_currency: {
			[currency: string]: number
		}
		price_change_percentage_7d: number
		price_change_percentage_30d_in_currency: {
			[currency: string]: number
		}
		price_change_percentage_30d: number
		price_change_percentage_60d_in_currency: {
			[currency: string]: number
		}
		price_change_percentage_60d: number
		price_change_percentage_1y_in_currency: {
			[currency: string]: number
		}
		price_change_percentage_1y: number
		max_supply: number
	}
	description: {
		en: string
	}
}
export const getCoinDetail = slug => get<CoinDataCG>(`${HOST_CG}/coins/${slug}?market_data=true`, {}, false)

// /coins/list?include_platform=false
export const getAllCoinIds = () => get(`${HOST_CG}/coins/list?include_platform=false`, {}, false)

// /search/trending
export type GetTrendingResponse = {
	coins: {
		item: {
			id: string
			coin_id: number
			name: string
			symbol: string
			market_cap_rank: string
			thumb: string
			small: string
			large: string
			slug: string
			price_btc: number
			score: number
		}
	}[]
	exchanges: {
		item: {
			id: string
			coin_id: number
			name: string
			symbol: string
			market_cap_rank: string
			thumb: string
			small: string
			large: string
			slug: string
			price_btc: number
			score: number
		}
	}[]
}

export const getTrending = () => get<GetTrendingResponse>(`${HOST_CG}/search/trending`, {}, false)

// /coins/{}/tickers?order=volume_desc&depth=true
export type CoinMarketResponse = {
	tickers: {
		coin_id: string
		cost_to_move_up_usd: number
		cost_to_move_down_usd: number
		last: number
		bid_ask_spread_percentage: number
		converted_volume: {
			usd: number
		}
		base: string
		target: string
		market: {
			logo: string
			name: string
			identifier: string
		}
		trade_url: string
		trust_score: string
		volume: number
	}[]
}

export const getCoinMarkets = (params, id) => get<CoinMarketResponse>(`${HOST_CG}/coins/${id}/tickers`, params, false)

// /v3/exchanges
export type TExchangeDetail = {
	facebook_url: string
	reddit_url: string
	image: string
	name: string
	trade_volume_24h_btc_normalized: number
	twitter_handle: string
	url: string
	trust_score: number
	other_url_1: string
	other_url_2: string
	tickers: {
		bid_ask_spread_percentage: number
		coin_id: string
		base: string
		last: number
		trade_url: string
		target: string
		trust_score: string
		volume: number
	}[]
}

export const getExchangesDetail = id => get<TExchangeDetail>(`${HOST_CG}/exchanges/${id}`, {}, false)

// /v3/exchanges/binance/volume_chart
export const getExchangeChart = (id: string, params) => get(`${HOST_CG}/exchanges/${id}/volume_chart`, params)

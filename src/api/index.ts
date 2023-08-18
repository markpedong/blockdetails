import { get } from '@/api/http'

const HOST_CG = process.env.NEXT_PUBLIC_HOST_CG
const HOST_CMC = process.env.NEXT_PUBLIC_HOST_CMC
const HOST_PAP = process.env.NEXT_PUBLIC_HOST_PAP

// /v1/global-metrics/quotes/latest
export type GlobalData = {
	active_cryptocurrencies: number
	active_exchanges: number
	btc_dominance: number
	btc_dominance_24h_percentage_change: number
	eth_dominance: number
	eth_dominance_24h_percentage_change: number
	quotes: {
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

// /v1/fiat/map
export type Fiat = {
	sign: string
	symbol: string
}

export const getFiats = params => get<Fiat[]>(`${HOST_CMC}/v1/fiat/map`, params)

// /v3/exchanges
export type Exchange = {
	country: string
	description: string
	fiats: { name: string; symbol: string }[]
	id: string
	image: string
	markets: number
	name: string
	sessions_per_month: number
	trade_volume_24h_btc_normalized: number
	trade_volume_24h_btc: number
	trust_score_rank: number
	trust_score: number
	url: string
	year_established: number
}
export const getExchanges = params => get<Exchange[]>(`${HOST_CG}/exchanges`, params)

export const getExchangesPaprika = params => get(`${HOST_PAP}/exchanges`, params, false)

// v3/coins/bitcoin
// fix this bug
export const getCryptoDetail = params => get(`${HOST_CG}/coins/bitcoin`, params)

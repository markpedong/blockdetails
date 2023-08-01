import { get } from '@/api/http'

const HOST = process.env.NEXT_PUBLIC_HOST_PROD

// /v1/global-metrics/quotes/latest
export type GlobalData = {
	active_cryptocurrencies: number
	total_cryptocurrencies: number
	active_market_pairs: number
	active_exchanges: number
	total_exchanges: number
}
export const getGlobalCrypto = () => get<GlobalData>(`${HOST}/v1/global-metrics/quotes/latest`)

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
	total_supply: number
}

export const getCryptocurrency = (params: any = {}) =>
	get<Cryptocurrency[]>(`${HOST}/v1/cryptocurrency/listings/latest`, params)

// /v1/fiat/map
export type Fiat = {
	id: number
	name: string
	sign: string
	symbol: string
}
export const getFiats = () => get<Fiat[]>(`${HOST}/v1/fiat/map`)

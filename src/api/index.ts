import { fetchGet, get } from '@/api/http'

const HOST = process.env.NEXT_PUBLIC_HOST

export type Cryptocurrency = {
	cmc_rank: number
	circulating_supply: number
	id: number
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

export const getCryptocurrency = (params = {}) =>
	get<Cryptocurrency>(`${HOST}/v1/cryptocurrency/listings/latest`, params)

export const fetchCryptocurrency = (params: any = {}) => fetchGet(`${HOST}/v1/cryptocurrency/listings/latest`, params)

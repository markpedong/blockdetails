import { get } from '@/api/http';

const HOST = 'https://pro-api.coinmarketcap.com/v1';

// /cryptocurrency/listings/latest
export type CoinData = {
	id: number;
	name: string;
	symbol: string;
	slug: string;
	max_supply: number;
	circulating_supply: number;
	total_supply: number;
	cmc_rank: number;
	quote: {
		[currency: string]: {
			price: number;
			percent_change_1h: number;
			percent_change_24h: number;
			percent_change_7d: number;
			market_cap: number;
			volume_24h: number;
		};
	};
};
export const getAllCoins = (params: {}) => get<CoinData[]>(`${HOST}/cryptocurrency/listings/latest`, params);

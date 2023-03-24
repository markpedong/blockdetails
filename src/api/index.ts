import { get } from './http';

const HOST = 'https://api.coingecko.com/api/v3';

// /api/v3/coins/markets
export type CoinData = {
	id: string;
	circulating_supply: number;
	current_price: number;
	image: string;
	market_cap: number;
	max_supply: number;
	name: string;
	symbol: string;
	total_volume: number;
	price_change_percentage_24h: number;
};
export const getAllCoins = (params: {}) => get<CoinData[]>(`${HOST}/coins/markets`, params);

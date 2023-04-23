import { get } from '@/api/http';
import axios from 'axios';

const HOST = 'https://api.coingecko.com/api/v3';

// /coins/markets
export type CoinData = {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	market_cap: number;
	market_cap_rank: number;
	total_volume: number;
	circulating_supply: number;
	price_change_percentage_1h_in_currency: number;
	price_change_percentage_24h_in_currency: number;
	price_change_percentage_7d_in_currency: number;
};

export const getAllCoins = (params: {}) => get<CoinData[]>(`${HOST}/coins/markets`, params);

// /exchanges
export type Exchange = {
	id: string;
	name: string;
	url: string;
	image: string;
	trust_score: number;
	trust_score_rank: number;
	trade_volume_24h_btc: number;
	trade_volume_24h_btc_normalized: number;
};

export const getExchanges = params => get<Exchange[]>(`${HOST}/exchanges`, params);

// /global
export type GLOBAL_DATA = {
	active_cryptocurrencies: number;
	markets: number;
};

export const getGlobalData = () => get<GLOBAL_DATA>(`${HOST}/global`);

// ${host}
export const getCoinData = params => get(`${HOST}/coins/bitcoin?`, params);

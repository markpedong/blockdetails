import { get } from '@/api/http';
import axios from 'axios';

const CMC = 'https://pro-api.coinmarketcap.com/v1';
const ASSET = 'https://s2.coinmarketcap.com';
const GECKO = 'https://api.coingecko.com/api/v3';

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
	price: number;
	percent_change_1h: number;
	percent_change_24h: number;
	percent_change_7d: number;
	market_cap: number;
	volume_24h: number;
};

export const getAllCoins = (params: {}) => get<CoinData[]>(`${CMC}/cryptocurrency/listings/latest`, params);

// /static/img/coins/64x64
export const getImageLogo = (id: number) => `${ASSET}/static/img/coins/64x64/${id}.png`;

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
export const getExchanges = params => axios.get<Exchange[]>(`${GECKO}/exchanges`, { params });

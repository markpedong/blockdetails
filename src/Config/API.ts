export const TrendingCoins = (currency: string) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h`;

export const GLOBAL_API = "https://api.coingecko.com/api/v3/global";
export const DEFI_API =
  "https://api.coingecko.com/api/v3/global/decentralized_finance_defi";

export const SingleCoin = (id: string) =>
  `https://api.coingecko.com/api/v3/coins/${id}`;

export const CoinList = (currency: string, page: number, res_page: number) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${res_page}&page=${page}&sparkline=false`;

export const CoinChart = (
  id: string,
  currency: string,
  days: number | string
) => `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}
  `;

export const MarketList = (id: string, page: number) => `
  
  https://api.coingecko.com/api/v3/coins/${id}/tickers?include_exchange_logo=true&page=${page}&order=volume_desc&depth=true

  `;

export const ExchangesList = (page: number, per_page: number) => `
  https://api.coingecko.com/api/v3/exchanges?per_page=${per_page}&page=${page}
  `;

export const Exchange_PAPRIKA = () =>
  `https://api.coinpaprika.com/v1/exchanges`;

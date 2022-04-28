export const TrendingCoins = (currency: string) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h`;

export const BITCOIN = (currency: string) =>
  `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`;

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

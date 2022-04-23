export const TrendingCoins = (currency: string) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h`;

export const GLOBAL_API = "https://api.coingecko.com/api/v3/global";

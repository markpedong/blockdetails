import { post } from "./http";

const MARKET = "https://api.coingecko.com/api/v3/coins/markets";

export const getAllCoins = (params: {}) => post(`${MARKET}`, params);

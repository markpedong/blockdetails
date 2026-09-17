// Backward-compat shim: pages importing from 'lib/crypto' get the new service.

export type {
  Coin,
  CoinDetail,
  MarketChartPoint,
  GlobalMarketData,
  TrendingCoin,
  ExchangeSummary,
  ExchangeDetail,
  ExchangeMarketPair,
  PaginatedResponse,
} from './crypto/types'

export {
  getCoinsPaginated as getCoins,
  getCoinDetail,
  getMarketChart,
  getGlobalData,
  getTrending,
  searchCoins,
  getCoinsList,
  getExchangesPaginated as getExchanges,
  getExchangeDetail,
  getExchangeMarkets,
  getExchangeList as getExchangesList,
} from './crypto/service'

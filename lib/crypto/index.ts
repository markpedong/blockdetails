// Re-export types and service for backward compatibility.
// Old code importing from 'lib/crypto' still works via these exports.

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
} from './types'

// Re-export old function names → new service functions for minimal page changes.
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
} from './service'

// Currency helpers (unchanged)
export { SUPPORTED_CURRENCIES, getDefaultCurrency, persistCurrency, parseCurrencyFromUrl } from '../currency'

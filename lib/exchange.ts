// Backward-compat shim: pages importing from 'lib/exchange' get the new service.

export type {
  ExchangeMarketPair,
  ExchangeDetail,
  ExchangeSummary,
} from './crypto/types'

export {
  getExchangesPaginated as getExchanges,
  getExchangeDetail,
  getExchangeMarkets,
  getExchangeList,
} from './crypto/service'

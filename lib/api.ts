// Backward-compat shim: pages importing from 'lib/api' get the new service.

export { getExchangesPaginated as getExchanges, getExchangeDetail, getExchangeMarkets, getExchangeList } from './crypto/service'
export type { ExchangeSummary, ExchangeDetail, ExchangeMarketPair, PaginatedResponse } from './crypto/types'

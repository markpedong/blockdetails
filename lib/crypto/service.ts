import 'server-only'
import { unstable_cache } from 'next/cache'
import { createCryptoClient } from './core'

// Only this server boundary reads credentials. The normalized core is independently testable.
const client = createCryptoClient({
  onFailure: (provider, capability, code, status) => console.warn('[crypto]', { provider, capability, code, status }),
  primary: process.env.CRYPTO_PRIMARY_PROVIDER === 'coinmarketcap' ? 'coinmarketcap' : 'coingecko',
  coinmarketcapKey: process.env.COINMARKETCAP_API_KEY,
  coingeckoDemoKey: process.env.COINGECKO_DEMO_API_KEY ?? process.env.COINGECKO_API_KEY,
  coingeckoProKey: process.env.COINGECKO_PRO_API_KEY,
})
export { CryptoError } from './core'
export type * from './types'

// Next's persistent cache stores validated successes; thrown failures are never empty successes.
export const getMarkets = unstable_cache(client.getMarkets, ['crypto-markets-v1'], { revalidate: 60 })
export const getCoin = unstable_cache(client.getCoin, ['crypto-coin-v1'], { revalidate: 60 })
export const getChart = unstable_cache(client.getChart, ['crypto-chart-v1'], { revalidate: 300 })
export const getGlobal = unstable_cache(client.getGlobal, ['crypto-global-v1'], { revalidate: 60 })
export const getTrending = unstable_cache(client.getTrending, ['crypto-trending-v1'], { revalidate: 300 })
export const searchCoins = unstable_cache(client.searchCoins, ['crypto-search-v1'], { revalidate: 300 })
export const getExchanges = unstable_cache(client.getExchanges, ['crypto-exchanges-v1'], { revalidate: 300 })
export const getExchange = unstable_cache(client.getExchange, ['crypto-exchange-v1'], { revalidate: 300 })
export const getExchangeMarkets = unstable_cache(client.getExchangeMarkets, ['crypto-exchange-markets-v1'], { revalidate: 60 })
export const getCoinMarkets = unstable_cache(client.getCoinMarkets, ['crypto-coin-markets-v1'], { revalidate: 60 })
export const getCategories = unstable_cache(client.getCategories, ['crypto-categories-v1'], { revalidate: 86400 })

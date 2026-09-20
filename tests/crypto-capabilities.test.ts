import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createCryptoClient } from '../lib/crypto/core.ts'
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status })
const cgCoin = { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 100, market_cap: 1000, total_volume: 20 }
const cmcCoin = { id: 1, name: 'Bitcoin', symbol: 'BTC', slug: 'bitcoin', quote: [{ symbol: 'USD', price: 101, market_cap: 1000, volume_24h: 20 }] }
const envelope = (data: unknown) => ({ status: { error_code: '0' }, data })
const pair = { base: 'BTC', target: 'USD', last: 100, converted_volume: { usd: 20, btc: 0.2 }, market: { identifier: 'binance', name: 'Binance' } }
const exchange = { id: 'binance', name: 'Binance', trade_volume_24h_btc: 100, tickers: [pair] }
const cgBodies: Record<string, unknown> = {
  '/coins/markets': [cgCoin], '/coins/bitcoin/market_chart': { prices: [[1000, 10], [2000, 20]] },
  '/global': { data: { total_market_cap: { usd: 1000 }, total_volume: { usd: 20 }, market_cap_percentage: { btc: 50 }, active_cryptocurrencies: 100 } },
  '/search/trending': { coins: [{ item: { id: 'bitcoin' } }] }, '/search': { coins: [cgCoin] },
  '/exchanges': [exchange], '/exchanges/binance': exchange, '/exchanges/binance/tickers': { tickers: [pair] }, '/coins/bitcoin/tickers': { tickers: [pair] },
  '/coins/categories/list': [{ category_id: 'layer-1', name: 'Layer 1' }],
}
function cgFetch(input: string | URL | Request) {
  const path = new URL(String(input)).pathname.replace('/api/v3', '')
  if (!(path in cgBodies)) throw new Error(`Unexpected path ${path}`)
  return Promise.resolve(json(cgBodies[path]))
}
test('every public CG capability normalizes the production adapter', async () => {
  const c = createCryptoClient({ fetch: cgFetch })
  assert.equal((await c.getMarkets())[0].current_price, 100)
  assert.deepEqual((await c.getChart('bitcoin')).prices, [[1000, 10], [2000, 20]])
  assert.equal((await c.getGlobal()).total_market_cap.usd, 1000)
  assert.equal((await c.getTrending())[0].id, 'bitcoin')
  assert.equal((await c.searchCoins('bitcoin'))[0].id, 'bitcoin')
  assert.equal((await c.getExchanges())[0].id, 'binance')
  assert.equal((await c.getExchange('binance')).pairs[0].last_price, 100)
  assert.equal((await c.getExchangeMarkets('binance'))[0].volume_24h_usd, 20)
  assert.equal((await c.getCoinMarkets('bitcoin'))[0].market_id, 'binance')
  assert.equal((await c.getCategories())[0].id, 'layer-1')
})
test('official keyless CMC accepts its live string error_code and sends no keys', async () => {
  const calls: { url: string; headers: Headers }[] = []
  const c = createCryptoClient({ primary: 'coinmarketcap', coingeckoDemoKey: 'fixture-cg-key', fetch: async (input, init) => {
    calls.push({ url: String(input), headers: new Headers(init?.headers) })
    return json(envelope([cmcCoin]))
  } })
  const coin = (await c.getMarkets())[0]
  assert.equal(coin.provider, 'coinmarketcap')
  assert.equal(coin.coinmarketcap_id, 1)
  assert.equal(coin.coingecko_id, 'bitcoin')
  assert.equal(calls.length, 1)
  assert.match(calls[0].url, /\/public-api\/v3\/cryptocurrency\/listings\/latest/)
  assert.equal(calls[0].headers.has('X-CMC_PRO_API_KEY'), false)
  assert.equal(calls[0].headers.has('x-cg-demo-api-key'), false)
})
for (const [name, response] of [
  ['429', () => json({}, 429)], ['5xx', () => json({}, 502)],
  ['malformed JSON', () => new Response('{')], ['malformed schema', () => json(envelope([{}]))],
  ['missing price', () => json(envelope([{ ...cmcCoin, quote: [{ symbol: 'USD' }] }]))],
  ['quota', () => json({ status: { error_code: 1008 } })],
] as const) test(`CMC ${name} falls back to compatible CG`, async () => {
  const c = createCryptoClient({ primary: 'coinmarketcap', fetch: (input) => String(input).includes('coinmarketcap') ? Promise.resolve(response()) : cgFetch(input) })
  assert.equal((await c.getMarkets())[0].provider, 'coingecko')
})
test('CMC timeout falls back; unsupported keyless chart skips HTTP', async () => {
  const calls: string[] = []
  const c = createCryptoClient({ primary: 'coinmarketcap', timeoutMs: 5, fetch: input => {
    calls.push(String(input)); return String(input).includes('coinmarketcap') ? new Promise(() => {}) : cgFetch(input)
  } })
  assert.equal((await c.getMarkets())[0].provider, 'coingecko')
  calls.length = 0
  assert.equal((await c.getChart('bitcoin')).prices.length, 2)
  assert.equal(calls.length, 1)
  assert.match(calls[0], /coingecko/)
})
test('no CMC key: unsupported capabilities route to CG without contacting CMC', async () => {
  // searchCoins and getCategories are unsupported by CMC — must route to CG even when CMC is primary
  const calls: string[] = []
  const c = createCryptoClient({ primary: 'coinmarketcap', fetch: async input => {
    calls.push(String(input))
    return cgFetch(input)
  } })
  assert.equal((await c.searchCoins('bitcoin'))[0].id, 'bitcoin')
  assert.equal((await c.getCategories())[0].id, 'layer-1')
  assert.ok(calls.every(url => /coingecko/.test(url)), 'All calls should go to CG for CMC-unsupported capabilities')
})
test('CMC authenticated endpoints require key; without key they are unsupported and fall back', async () => {
  // getCoin uses /v2/cryptocurrency/info (keyed metadata) — without key, CMC can't fulfill, falls back to CG
  const calls: string[] = []
  const c = createCryptoClient({ primary: 'coinmarketcap', fetch: async input => {
    calls.push(String(input))
    if (String(input).includes('coinmarketcap')) {
      // CMC keyless: /v2/info is not in the keyless allowlist → unsupported
      if (String(input).includes('/v2/cryptocurrency/info')) throw new Error('Should not reach CMC for keyed endpoint')
      return json(envelope([{ ...cmcCoin, id: 1, name: 'Bitcoin', symbol: 'BTC', quote: [{ symbol: 'USD', price: 100, market_cap: 1000, volume_24h: 20 }] }]))
    }
    return json({ ...cgCoin, id: 'bitcoin', market_data: { current_price: { usd: 100 }, market_cap: { usd: 1000 }, total_volume: { usd: 20 }, circulating_supply: 19000000 } })
  } })
  const coin = await c.getCoin('bitcoin')
  assert.equal(coin.current_price, 100)
  // Should have fallen back to CG for the metadata portion
  assert.ok(calls.some(url => /coingecko/.test(url)), 'Should fall back to CG when CMC lacks keyed endpoint')
})
test('CMC authenticated metadata, chart and global contracts normalize', async () => {
  const c = createCryptoClient({ primary: 'coinmarketcap', coinmarketcapKey: 'fixture', fetch: async input => {
    const path = new URL(String(input)).pathname
    const data: Record<string, unknown> = {
      '/v3/cryptocurrency/quotes/latest': [cmcCoin],
      '/v2/cryptocurrency/info': { '1': { id: 1, description: 'Bitcoin', urls: { website: ['https://bitcoin.org'] } } },
      '/v3/cryptocurrency/quotes/historical': { id: 1, quotes: [{ timestamp: '2026-01-01T00:00:00Z', quote: [{ symbol: 'USD', price: 90 }] }] },
      '/v1/global-metrics/quotes/latest': { btc_dominance: 50, active_cryptocurrencies: 100, quote: { USD: { total_market_cap: 1000, total_volume_24h: 20 } } },
    }
    return json(envelope(data[path]))
  } })
  assert.equal((await c.getCoin('bitcoin')).description, 'Bitcoin')
  assert.equal((await c.getChart('bitcoin')).prices[0][1], 90)
  assert.equal((await c.getGlobal()).total_market_cap.usd, 1000)
})
test('paginated requested IDs validate all quotes before slicing', async () => {
  const ids = ['ethereum', 'bitcoin']
  const c = createCryptoClient({ fetch: async () => json([cgCoin, { ...cgCoin, id: 'ethereum', name: 'Ethereum', market_cap: 500 }]) })
  assert.equal((await c.getMarkets({ ids, perPage: 1 }))[0].id, 'bitcoin')
  assert.equal((await c.getMarkets({ ids, page: 2, perPage: 1 }))[0].id, 'ethereum')
})

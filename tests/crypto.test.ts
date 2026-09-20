import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createCryptoClient, CryptoError } from '../lib/crypto/core.ts'

// Synthetic upstream fixtures test the real production adapters/router, not live availability.
const cg = { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 100, market_cap: 1000, total_volume: 200 }
const cmc = { id: 1, name: 'Bitcoin', symbol: 'BTC', quote: [{ symbol: 'USD', price: 101, market_cap: 1000, volume_24h: 200 }] }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })
const envelope = (data: unknown) => ({ status: { error_code: 0 }, data })
const isCg = (input: string | URL | Request) => String(input).includes('coingecko.com')
const unavailable = (error: unknown) => error instanceof CryptoError && error.code === 'UNAVAILABLE'

test('healthy CoinGecko normalizes quotes without calling fallback', async () => {
  let calls = 0
  const client = createCryptoClient({ coinmarketcapKey: 'test-fixture', fetch: async () => { calls++; return json([cg]) } })
  const result = await client.getMarkets()
  assert.equal(result[0].current_price, 100)
  assert.equal(result[0].provider, 'coingecko')
  assert.equal(calls, 1)
})
for (const [name, response] of [
  ['429', () => json({}, 429)], ['500', () => json({}, 500)], ['503', () => json({}, 503)],
  ['malformed JSON', () => new Response('{')], ['invalid schema', () => json([{ id: 'bitcoin' }])],
  ['missing prices', () => json([{ ...cg, current_price: undefined }])], ['quota envelope', () => json({ status: { error_code: 10005 } })],
] as const) {
  test(`CoinGecko ${name} falls back to normalized CMC`, async () => {
    const client = createCryptoClient({ coinmarketcapKey: 'test-fixture', fetch: async input => isCg(input) ? response() : json(envelope([cmc])) })
    const [coin] = await client.getMarkets()
    assert.equal(coin.id, 'bitcoin')
    assert.equal(coin.current_price, 101)
    assert.equal(coin.provider, 'coinmarketcap')
  })
}
test('timeout falls back even when upstream ignores AbortSignal', async () => {
  const client = createCryptoClient({ timeoutMs: 5, coinmarketcapKey: 'test-fixture', fetch: input => isCg(input) ? new Promise(() => {}) : Promise.resolve(json(envelope([cmc]))) })
  assert.equal((await client.getMarkets())[0].current_price, 101)
})
test('CMC can be primary; CMC outage falls back to CG', async () => {
  const visited: string[] = []
  const client = createCryptoClient({ primary: 'coinmarketcap', coinmarketcapKey: 'test-fixture', fetch: async input => { visited.push(String(input)); return isCg(input) ? json([cg]) : json({}, 500) } })
  assert.equal((await client.getMarkets())[0].provider, 'coingecko')
  assert.match(visited[0], /coinmarketcap/)
})
test('healthy primary CMC never contacts CG', async () => {
  const client = createCryptoClient({ primary: 'coinmarketcap', coinmarketcapKey: 'test-fixture', fetch: async input => { assert.equal(isCg(input), false); return json(envelope([cmc])) } })
  assert.equal((await client.getMarkets())[0].provider, 'coinmarketcap')
})
test('both unavailable returns a safe explicit failure, not an empty success', async () => {
  const client = createCryptoClient({ coinmarketcapKey: 'test-fixture', fetch: async () => json({}, 503) })
  await assert.rejects(client.getMarkets(), unavailable)
})
test('duplicate symbols are never joined; unknown CMC IDs are namespaced', async () => {
  const client = createCryptoClient({ coinmarketcapKey: 'test-fixture', fetch: async input => isCg(input) ? json({}, 500) : json(envelope([{ ...cmc, id: 77777, name: 'Other Bitcoin' }])) })
  assert.equal((await client.getMarkets())[0].id, 'cmc:77777')
  await assert.rejects(client.getMarkets({ ids: ['other-bitcoin'] }), unavailable)
})
test('malformed requests are rejected before hitting providers', async () => {
  let calls = 0
  const client = createCryptoClient({ fetch: async () => { calls++; return json([]) } })
  for (const options of [{ page: NaN }, { page: 0 }, { currency: 'evil' }, { order: 'wrong' }, { ids: ['../secret'] }]) {
    await assert.rejects(client.getMarkets(options), error => error instanceof CryptoError && error.status === 400)
  }
  assert.equal(calls, 0)
})
test('successful requests are cached/deduplicated but failures are not', async () => {
  let calls = 0
  const client = createCryptoClient({ fetch: async () => { calls++; return calls === 1 ? json({}, 500) : json([cg]) } })
  await assert.rejects(client.getMarkets())
  await Promise.all([client.getMarkets(), client.getMarkets()])
  await client.getMarkets()
  assert.equal(calls, 3)
})
test('coin detail flattens price maps and renders metadata as text', async () => {
  const client = createCryptoClient({ fetch: async () => json({ id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: { large: 'https://example.com/btc.png' }, market_data: { current_price: { php: 6000 }, market_cap: { php: 10000 }, total_volume: { php: 500 }, circulating_supply: 10 }, description: { en: '<script>alert(1)</script><b>Bitcoin</b>' }, links: { homepage: ['javascript:alert(1)', 'https://bitcoin.org'] } }) })
  const coin = await client.getCoin('bitcoin', 'php')
  assert.equal(coin.current_price, 6000)
  assert.equal(coin.description, 'Bitcoin')
  assert.equal(coin.links.length, 1)
  assert.equal(coin.circulating_supply, 10)
})

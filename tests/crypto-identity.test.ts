import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createCryptoClient } from '../lib/crypto/core.ts'

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status })
const envelope = (data: unknown) => ({ status: { error_code: 0 }, data })
const cg = { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 100, market_cap: 1000, total_volume: 20 }
const cmc = { id: 1, name: 'Bitcoin', symbol: 'BTC', quote: [{ symbol: 'USD', price: 100, market_cap: 1000, volume_24h: 20 }] }

for (const primary of ['coingecko', 'coinmarketcap'] as const) {
  test(`${primary}: duplicate alias of same asset deduplicates to one result`, async () => {
    const c = createCryptoClient({ primary, fetch: async input => String(input).includes('coingecko') ? json([cg]) : json(envelope([cmc])) })
    // 'bitcoin' and 'cmc:1' are the same asset — should dedupe to one
    const ids = ['bitcoin', 'cmc:1']
    const result = await c.getMarkets({ ids })
    assert.equal(result.length, 1)
    assert.equal(result[0].id, 'bitcoin')
  })
  test(`${primary}: distinct aliases survive quote batches`, async () => {
    const cgBoth = [cg, { ...cg, id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 50 }]
    const cmcBoth = [cmc, { ...cmc, id: 1027, name: 'Ethereum', symbol: 'ETH', quote: [{ symbol: 'USD', price: 50, market_cap: 500, volume_24h: 10 }] }]
    const c = createCryptoClient({ primary, fetch: async input => String(input).includes('coingecko') ? json(cgBoth) : json(envelope(cmcBoth)) })
    const ids = ['bitcoin', 'ethereum']
    assert.deepEqual((await c.getMarkets({ ids })).map(c => c.id).sort(), ids)
    assert.equal((await c.getMarkets({ ids, page: 2, perPage: 1 }))[0]?.id, 'ethereum')
  })
  test(`${primary}: missing requested asset fails closed`, async () => {
    const c = createCryptoClient({ primary, fetch: async () => json([cg]) })
    // Requesting 'ethereum' but provider only returns 'bitcoin' — should fail
    await assert.rejects(c.getMarkets({ ids: ['ethereum'] }))
  })
}
test('expanded reviewed identity resolves Chainlink without a slug join', async () => {
  const c = createCryptoClient({ primary: 'coinmarketcap', fetch: async input => {
    assert.match(String(input), /coinmarketcap/)
    return json(envelope([{ ...cmc, id: 1975, name: 'Chainlink', symbol: 'LINK' }]))
  } })
  const [coin] = await c.getMarkets({ ids: ['chainlink'] })
  assert.equal(coin.id, 'chainlink')
  assert.equal(coin.coinmarketcap_id, 1975)
})
test('unknown CMC-only asset gets namespaced ID and does not alias to existing', async () => {
  const c = createCryptoClient({ primary: 'coinmarketcap', fetch: async () => {
    return json(envelope([{ ...cmc, id: 99999, name: 'UnknownCoin', symbol: 'UNK' }]))
  } })
  const [coin] = await c.getMarkets({ ids: ['cmc:99999'] })
  assert.equal(coin.id, 'cmc:99999')
  assert.equal(coin.coinmarketcap_id, 99999)
  assert.equal(coin.coingecko_id, null)
})

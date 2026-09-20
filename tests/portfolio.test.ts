import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculatePortfolio, parsePortfolio, serializePortfolio, loadPortfolio, savePortfolio, formatUnits, MONEY_SCALE, QUANTITY_SCALE } from '../lib/portfolio.ts'
import type { PortfolioTransaction } from '../lib/portfolio.ts'

const tx = (id: string, type: PortfolioTransaction['type'], quantity: string, price = '0', fees = '0', date = '2026-01-01T00:00:00.000Z'): PortfolioTransaction => ({ id, type, assetId: 'bitcoin', quantity, price, fees, date, notes: '' })
const dollars = (v: bigint) => formatUnits(v, MONEY_SCALE, 2)

test('weighted average partial sale capitalizes buy fees and deducts sell fees once', () => {
  const p = calculatePortfolio([tx('a', 'BUY', '2', '100', '2'), tx('b', 'BUY', '1', '160', '1'), tx('c', 'SELL', '1', '200', '3')], { bitcoin: '150' })
  assert.equal(dollars(p.holdings[0].cost), '242.00')
  assert.equal(dollars(p.holdings[0].averageCost), '121.00')
  assert.equal(dollars(p.realized), '76.00')
  assert.equal(dollars(p.unrealized!), '58.00')
  assert.equal(dollars(p.totalProfit!), '134.00')
  assert.equal(p.profitPercent, '36.91')
  assert.equal(p.holdings[0].allocation, '100.00')
})

test('transfers carry acquisition basis and never realize sale proceeds', () => {
  const p = calculatePortfolio([tx('a', 'TRANSFER_IN', '4', '50', '4'), tx('b', 'TRANSFER_OUT', '1', '0', '2')], { bitcoin: '60' })
  assert.equal(dollars(p.holdings[0].cost), '153.00')
  assert.equal(dollars(p.realized), '-2.00')
  assert.equal(dollars(p.totalProfit!), '25.00')
  assert.equal(dollars(p.trackedCost), '155.00')
})

test('rewards, airdrops and staking rewards have zero purchase basis plus fees', () => {
  for (const type of ['REWARD', 'AIRDROP', 'STAKING_REWARD'] as const) {
    const p = calculatePortfolio([tx('a', type, '2', '0', '1'), tx('b', 'SELL', '1', '10', '1')], { bitcoin: '10' })
    assert.equal(dollars(p.realized), '8.50')
    assert.equal(dollars(p.totalProfit!), '18.00')
    assert.throws(() => calculatePortfolio([tx('a', type, '1', '1')]), /zero/)
  }
})

test('same timestamp uses saved array order, not random IDs; backdated and deleted buys reject oversells', () => {
  const buy = tx('z', 'BUY', '1', '100')
  const sell = tx('a', 'SELL', '1', '120')
  assert.equal(dollars(calculatePortfolio([buy, sell]).realized), '20.00')
  assert.throws(() => calculatePortfolio([sell, buy]), /exceeds/)
  assert.throws(() => calculatePortfolio([buy, { ...sell, date: '2025-12-31T23:59:59.000Z' }]), /exceeds/)
  assert.throws(() => calculatePortfolio([sell]), /exceeds/)
  assert.throws(() => calculatePortfolio([{ ...buy, quantity: '0.5' }, sell]), /exceeds/)
})

test('18-place quantities and prices retain products down to 36 decimal places', () => {
  const p = calculatePortfolio([tx('a', 'BUY', '0.000000000000000001', '0.000000000000000001')], { bitcoin: '0.000000000000000002' })
  assert.equal(p.holdings[0].quantity, BigInt(1))
  assert.equal(p.holdings[0].cost, BigInt(1))
  assert.equal(p.totalProfit, BigInt(1))
  assert.equal(p.profitPercent, '100.00')
  assert.equal(formatUnits(p.holdings[0].quantity, QUANTITY_SCALE, 18), '0.000000000000000001')
})

test('full sale removes rounding residue and zero holdings do not require quotes', () => {
  const p = calculatePortfolio([tx('a', 'BUY', '3', '0', '1'), tx('b', 'SELL', '1', '1'), tx('c', 'SELL', '2', '1')])
  assert.equal(p.holdings[0].cost, BigInt(0))
  assert.equal(p.marketValue, BigInt(0))
  assert.equal(dollars(p.totalProfit!), '2.00')
})

test('missing or malformed quotes make totals and allocations unavailable, not zero', () => {
  for (const quotes of [{}, { bitcoin: 'NaN' }, { bitcoin: -1 }, { bitcoin: null }]) {
    const p = calculatePortfolio([tx('a', 'BUY', '1', '100')], quotes)
    assert.equal(p.marketValue, null)
    assert.equal(p.unrealized, null)
    assert.equal(p.totalProfit, null)
    assert.equal(p.holdings[0].allocation, null)
  }
  assert.equal(calculatePortfolio([tx('a', 'BUY', '1', '100')], { bitcoin: 0 }).marketValue, BigInt(0))
  assert.equal(calculatePortfolio([tx('a', 'BUY', '1', '1')], { bitcoin: 1e-8 }).marketValue, BigInt('10000000000000000000000000000'))
})

test('versioned import validates all records and accounting before replacing data', () => {
  const valid = serializePortfolio([tx('a', 'BUY', '1', '100')])
  assert.equal(parsePortfolio(valid).length, 1)
  for (const raw of ['nope', '{}', '{"version":2,"currency":"USD","transactions":[]}', valid.replace('"USD"', '"EUR"')]) assert.throws(() => parsePortfolio(raw))
  for (const change of [{ quantity: '0' }, { quantity: '-1' }, { quantity: '1e3' }, { quantity: '0.0000000000000000001' }, { price: 1 }, { fees: '-1' }, { assetId: '__proto__' }, { type: 'SWAP' }, { date: '2026-02-30T00:00:00.000Z' }, { notes: 'x'.repeat(1001) }]) {
    assert.throws(() => parsePortfolio(JSON.stringify({ version: 1, currency: 'USD', transactions: [{ ...tx('a', 'BUY', '1'), ...change }] })))
  }
  assert.throws(() => serializePortfolio([tx('a', 'BUY', '1'), tx('a', 'BUY', '1')]), /Duplicate/)
})

test('saved JSON round trips all seven transaction types with decimal strings and stable order', () => {
  const input = [tx('a', 'BUY', '3', '100.125', '0.25'), tx('b', 'SELL', '0.5', '110', '0.1'), tx('c', 'TRANSFER_IN', '1', '50'), tx('d', 'TRANSFER_OUT', '0.25'), tx('e', 'REWARD', '0.01'), tx('f', 'AIRDROP', '0.02'), { ...tx('g', 'STAKING_REWARD', '0.03'), notes: 'My staking reward 日本語' }]
  let stored: string | null = null
  const storage = { getItem: () => stored, setItem: (_: string, value: string) => { stored = value } }
  const raw = savePortfolio(storage, input, null)
  const loaded = loadPortfolio(storage)
  assert.equal(loaded.raw, raw)
  assert.deepEqual(loaded.transactions, input)
  assert.deepEqual(calculatePortfolio(loaded.transactions, { bitcoin: '120' }), calculatePortfolio(input, { bitcoin: '120' }))
  assert.equal(JSON.parse(raw).currency, 'USD')
  assert.equal(JSON.parse(raw).version, 1)
  assert.equal(typeof JSON.parse(raw).transactions[0].quantity, 'string')
})

test('allocation is based on total market value and one missing asset invalidates totals', () => {
  const input = [tx('a', 'BUY', '1', '10'), { ...tx('b', 'BUY', '2', '10'), assetId: 'ethereum' }]
  const p = calculatePortfolio(input, { bitcoin: '100', ethereum: '150' })
  assert.equal(dollars(p.marketValue!), '400.00')
  assert.deepEqual(p.holdings.map(h => h.allocation), ['25.00', '75.00'])
  const missing = calculatePortfolio(input, { bitcoin: '100' })
  assert.equal(missing.marketValue, null)
  assert.equal(missing.totalProfit, null)
  assert.equal(missing.profitPercent, null)
  assert.equal(dollars(missing.holdings[0].marketValue!), '100.00')
  assert.deepEqual(missing.missingPrices, ['ethereum'])
  assert.deepEqual(missing.holdings.map(h => h.allocation), [null, null])
})

test('zero-cost reward return percentage is undefined and a falling price shows negative profit', () => {
  const reward = calculatePortfolio([tx('a', 'REWARD', '1')], { bitcoin: '50' })
  assert.equal(reward.profitPercent, null)
  assert.equal(dollars(reward.totalProfit!), '50.00')
  const loss = calculatePortfolio([tx('a', 'BUY', '2', '100'), tx('b', 'SELL', '1', '50', '1')], { bitcoin: '50' })
  assert.equal(dollars(loss.totalProfit!), '-101.00')
  assert.equal(loss.profitPercent, '-50.50')
})

test('corrupt data and storage exceptions never silently become an editable empty portfolio', () => {
  assert.throws(() => loadPortfolio({ getItem: () => '{' }))
  assert.throws(() => loadPortfolio({ getItem: () => { throw new Error('blocked') } }), /blocked/)
  assert.deepEqual(loadPortfolio({ getItem: () => null }), { transactions: [], raw: null })
  let saved = 'previous'
  assert.throws(() => savePortfolio({ getItem: () => saved, setItem: () => { throw new Error('quota') } }, [tx('a', 'BUY', '1')], 'previous'), /quota/)
  assert.equal(saved, 'previous')
  assert.throws(() => savePortfolio({ getItem: () => 'other tab', setItem: (_, value) => { saved = value } }, [], 'previous'), /another tab/)
  assert.equal(saved, 'previous')
})

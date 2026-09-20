import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
const base = process.env.BLOCKDETAILS_URL || 'http://localhost:3100'
const paths = ['/api/coins?per_page=2', '/api/coins?ids=bitcoin,ethereum&vs_currency=eur', '/api/coins/bitcoin', '/api/coins/bitcoin/market_chart?days=7', '/api/coins/bitcoin/markets', '/api/global', '/api/trending', '/api/categories', '/api/coins/search?q=bitcoin', '/api/exchanges?per_page=2', '/api/exchanges/binance', '/api/exchanges/binance/markets']
const results = []
for (const path of paths) {
  await new Promise(resolve => setTimeout(resolve, 12000))
  try {
    const response = await fetch(base + path, { signal: AbortSignal.timeout(30000) })
    const body = await response.json()
    assert.equal(response.status, 200, JSON.stringify(body))
    assert.ok(body.data != null)
    if (Array.isArray(body.data)) assert.ok(body.data.length)
    results.push({ path, status: response.status, passed: true })
  } catch (error) { results.push({ path, passed: false, error: error.message }) }
}
for (const path of ['/api/coins?vs_currency=bad', '/api/coins?page=-1', '/api/coins/bitcoin/market_chart?days=99999']) {
  const response = await fetch(base + path)
  results.push({ path, status: response.status, passed: response.status === 400 })
}
await writeFile('/tmp/blockdetails-live-results.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
if (results.some(result => !result.passed)) process.exitCode = 1

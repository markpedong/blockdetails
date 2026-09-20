import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getDefaultCurrency, parseCurrencyFromUrl, persistCurrency } from '../lib/currency.ts'

test('URL currency is validated and defaults deterministically for SSR', async () => {
  assert.equal(await parseCurrencyFromUrl(Promise.resolve({ currency: 'PHP' })), 'php')
  assert.equal(await parseCurrencyFromUrl(Promise.resolve({ currency: 'invalid' })), 'usd')
})

test('blocked browser storage does not break currency selection', () => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage blocked') } })
  try {
    assert.doesNotThrow(() => getDefaultCurrency())
    assert.doesNotThrow(() => persistCurrency('php'))
  } finally {
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor)
    else Reflect.deleteProperty(globalThis, 'window')
    if (storageDescriptor) Object.defineProperty(globalThis, 'localStorage', storageDescriptor)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})

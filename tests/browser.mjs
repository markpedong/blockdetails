import assert from 'node:assert/strict'
import { interactions } from './browser-interactions.mjs'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir, homedir } from 'node:os'
import { join } from 'node:path'
const base = process.env.BLOCKDETAILS_URL || 'http://localhost:3100'
const chrome = [process.env.CHROME_BIN, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', join(homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'), '/usr/bin/chromium', '/usr/bin/google-chrome'].find(p => p && existsSync(p))
assert.ok(chrome, 'Set CHROME_BIN to an installed Chrome/Chromium binary')
const profile = await mkdtemp(join(tmpdir(), 'blockdetails-browser-'))
const browser = spawn(chrome, ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] })
let socket
let currentPath = ""
const errors = [], results = [], consoleErrors = []
let intercept = null
let handleDialog = null
try {
  const endpoint = await new Promise((resolve, reject) => {
    let log = ''
    const timer = setTimeout(() => reject(new Error('Chrome startup timed out')), 15000)
    browser.stderr.on('data', chunk => { log += chunk; const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) { clearTimeout(timer); resolve(match[1]) } })
    browser.on('error', reject)
  })
  const origin = new URL(endpoint).origin.replace('ws:', 'http:')
  const target = await (await fetch(`${origin}/json/new?about:blank`, { method: 'PUT' })).json()
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
  let sequence = 0
  const pending = new Map()
  socket.onmessage = event => {
    const message = JSON.parse(event.data)
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') consoleErrors.push({ path: currentPath, error: message.params.args.map(a => a.value ?? a.description).join(' ') })
    if (message.method === 'Fetch.requestPaused') intercept?.(message.params).catch(error => errors.push({ path: currentPath, error: String(error) }))
    if (message.method === 'Page.javascriptDialogOpening') handleDialog?.(message.params)
    if (message.method === 'Runtime.exceptionThrown') errors.push({ path: currentPath, error: message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text })
    if (message.id && pending.has(message.id)) { const { resolve, reject, timer } = pending.get(message.id); clearTimeout(timer); pending.delete(message.id); if (message.error) reject(new Error(message.error.message)); else resolve(message.result) }
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)) }, 30000)
    pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async expression => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value }
  const waitFor = async (expression, timeout = 25000) => { const end = Date.now() + timeout; while (Date.now() < end) { if (await evaluate(`Boolean(${expression})`)) return; await new Promise(resolve => setTimeout(resolve, 100)) } throw new Error(`Condition timed out: ${expression}`) }
  const navigate = async path => { currentPath = path; await send('Page.navigate', { url: base + path }); await waitFor(`location.pathname === ${JSON.stringify(path.split('?')[0])} && document.readyState === 'complete'`); }
  const click = text => evaluate(`(() => { const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}); if (!b || b.disabled) throw Error('Unavailable button'); b.click(); })()`)
  const fill = (label, value) => evaluate(`(() => { const l = [...document.querySelectorAll('form label')].find(l => l.textContent.startsWith(${JSON.stringify(label)})); const e = l?.querySelector('input'); if (!e) throw Error('Missing input'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(e, ${JSON.stringify(value)}); e.dispatchEvent(new Event('input', {bubbles:true})); })()`)
  await send('Runtime.enable'); await send('Page.enable')
  await interactions({ send, evaluate, waitFor, navigate, click, fill, results, setIntercept: fn => { intercept = fn }, setDialog: fn => { handleDialog = fn } })
  assert.deepEqual(consoleErrors, [], 'Browser console errors including hydration')
  const realErrors = errors => errors.filter(e => !/Invalid InterceptionId/.test(e.error))
  assert.deepEqual(realErrors(errors), [], 'Uncaught browser exceptions (excluding benign CDP InterceptionId during navigation)')
  console.log(JSON.stringify({ passed: results, exceptions: errors, consoleErrors, screenshot: '/tmp/blockdetails-portfolio.png' }, null, 2))
  /* Legacy live smoke is opt-in; deterministic interactions above never prove provider fallback. */
  if (process.env.BROWSER_LIVE_SMOKE) {
  await navigate('/portfolio')
  await waitFor(`document.body.innerText.includes('Add transaction')`)
  await fill('Quantity', '2'); await fill('Price per unit', '100'); await fill('Total fee', '2'); await fill('Notes', 'Isolated runtime test')
  await click('Add transaction')
  await waitFor(`document.body.innerText.includes('Transaction added and saved')`)
  assert.equal(await evaluate(`JSON.parse(localStorage.getItem('blockdetails_portfolio_v1')).transactions.length`), 1)
  results.push('Portfolio add and persistence')
  await navigate('/portfolio')
  await waitFor(`document.body.innerText.includes('Isolated runtime test')`)
  await click('Edit'); await fill('Quantity', '3'); await click('Save changes')
  await waitFor(`JSON.parse(localStorage.getItem('blockdetails_portfolio_v1')).transactions[0].quantity === '3'`)
  results.push('Portfolio reload and edit')
  const png = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  await writeFile('/tmp/blockdetails-portfolio.png', Buffer.from(png.data, 'base64'))
  await evaluate(`document.querySelector('form select').value = 'SELL'; document.querySelector('form select').dispatchEvent(new Event('change', {bubbles:true}))`)
  await fill('Quantity', '4'); await fill('Price per unit', '150'); await click('Add transaction')
  await waitFor(`document.body.innerText.includes('exceeds holdings')`)
  assert.equal(await evaluate(`JSON.parse(localStorage.getItem('blockdetails_portfolio_v1')).transactions.length`), 1)
  results.push('Oversell rejected without data loss')
  await navigate('/cryptocurrency/bitcoin')
  await waitFor(`document.querySelector('button[aria-label="Add to watchlist"]')?.disabled === false`)
  await evaluate(`document.querySelector('button[aria-label="Add to watchlist"]').click()`)
  await waitFor(`document.querySelector('button[aria-label="Remove from watchlist"]') !== null`)
  await navigate('/watchlist')
  await waitFor(`document.body.innerText.includes('Bitcoin')`)
  results.push('Watchlist add and persistence')
  for (const [path, text] of [['/', 'Market'], ['/cryptocurrency', 'Cryptocurrencies'], ['/exchanges', 'Exchanges'], ['/exchanges/binance', 'Binance'], ['/categories', 'Categories'], ['/categories/layer-1', 'Layer'], ['/trending', 'Trending'], ['/gainers-losers', 'Gainers']]) {
    await new Promise(resolve => setTimeout(resolve, 12000))
    await navigate(path)
    if (errors.length) throw new Error(JSON.stringify(errors))
    await waitFor(`document.querySelector('main')?.innerText.toLowerCase().includes(${JSON.stringify(text.toLowerCase())}) || /unavailable|Unable to load/i.test(document.querySelector('main')?.innerText || '')`)
    const body = await evaluate('document.body.innerText')
    assert.ok(body.toLowerCase().includes(text.toLowerCase()) || /unavailable|Unable to load/i.test(body), `Missing ${text} at ${path}: ${body.slice(0, 800)}`)
    if (/unavailable|Unable to load/i.test(body)) results.push(`Provider degraded state ${path}`)
    else results.push(`Live data render ${path}`)
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await navigate('/portfolio')
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Mobile viewport overflows')
  results.push('Mobile portfolio width')
  assert.deepEqual(errors, [], 'Uncaught browser exceptions')
  console.log(JSON.stringify({ passed: results, exceptions: errors, screenshot: '/tmp/blockdetails-portfolio.png' }, null, 2))
  }
} finally { socket?.close(); browser.kill() }

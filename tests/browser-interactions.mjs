import assert from 'node:assert/strict'
import { writeFile, mkdtemp, readdir, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// SYNTHETIC API responses exercise the real UI, not provider fallback or live prices.
export async function interactions({ send, evaluate: ev, waitFor, navigate, click, fill, results, setIntercept, setDialog }) {
  const key = 'blockdetails_portfolio_v1'
  const saved = () => ev(`localStorage.getItem('${key}')`)
  const count = n => waitFor(`JSON.parse(localStorage.getItem('${key}'))?.transactions.length === ${n}`)
  const text = s => waitFor(`document.body.innerText.includes(${JSON.stringify(s)})`)
  const mark = s => { results.push(s); console.log('PASS', s) }
  const select = type => ev(`document.querySelector('form select').value=${JSON.stringify(type)};document.querySelector('form select').dispatchEvent(new Event('change',{bubbles:true}))`)
  const cssClick = s => ev(`document.querySelector(${JSON.stringify(s)}).click()`)
  const keypress = async (key, code, modifiers = 0) => { await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, modifiers }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers }) }
  let quoteMode = 'ok', searchMode = 'ok', chartMode = 'ok', accept = true
  const requests = []
  const coin = { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: null, market_cap_rank: 1, current_price: 200, price_change_percentage_24h: 2, price_change_percentage_1h_in_currency: 1, price_change_percentage_7d_in_currency: 3, market_cap: 1000000, total_volume: 10000 }
  setDialog(() => send('Page.handleJavaScriptDialog', { accept }).catch(() => {}))
  setIntercept(async ({ requestId, request }) => {
    const url = new URL(request.url)
    requests.push(url.pathname + url.search)
    let data, mode
    if (url.pathname === '/api/coins/search') { mode = searchMode; data = mode === 'empty' ? [] : [coin]; if (mode === 'slow') await new Promise(r => setTimeout(r, 1000)) }
    else if (url.pathname.endsWith('/market_chart')) { mode = chartMode; data = { prices: mode === 'empty' ? [] : [[1700000000000, 100], [1700003600000, 120], [1700007200000, 110]] } }
    else if (url.pathname === '/api/coins') { mode = quoteMode; data = mode === 'missing' ? [] : [coin] }
    else { await send('Fetch.continueRequest', { requestId }); return }
    await send('Fetch.fulfillRequest', { requestId, responseCode: mode === 'fail' ? 503 : 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(JSON.stringify(mode === 'fail' ? { error: 'Synthetic UI test failure' } : { data })).toString('base64') })
  })
  await send('Fetch.enable', { patterns: [{ urlPattern: '*/api/coins*' }] })
  await navigate('/portfolio?currency=usd'); await text('No holdings yet')
  for (const [index, type] of ['BUY','SELL','TRANSFER_IN','TRANSFER_OUT','REWARD','AIRDROP','STAKING_REWARD'].entries()) {
    await select(type); await fill('Quantity', type === 'BUY' ? '10' : '1')
    if (['BUY','SELL','TRANSFER_IN'].includes(type)) await fill(type === 'TRANSFER_IN' ? 'Acquisition cost' : 'Price per unit', type === 'SELL' ? '150' : '100')
    else assert.equal(await ev(`document.querySelectorAll('form input')[2].disabled`), true)
    await fill('Date and time', `2025-01-0${index + 1}T12:00`); await fill('Notes', `Synthetic ${type}`); await click('Add transaction'); await count(index + 1)
  }
  await text('$2400.00')
  const summary = await ev(`Object.fromEntries([...document.querySelector('[aria-label="Portfolio summary"]').children].map(e=>[e.children[0].textContent,e.children[1].textContent]))`)
  assert.deepEqual(summary, { 'Market value': '$2400.00', 'Remaining cost basis': '$900.00', 'Tracked invested value': '$1000.00', 'Realized P/L': '$50.00', 'Unrealized P/L': '$1500.00', 'Total P/L': '$1550.00', 'Total P/L %': '155.00%' })
  mark('SYNTHETIC: all seven transaction types and exact displayed accounting')
  const baseline = await saved()
  await click('Edit'); await fill('Quantity', '2'); await click('Cancel edit'); assert.equal(await saved(), baseline)
  await click('Edit'); await fill('Quantity', '2'); await click('Save changes'); await text('Transaction updated'); await navigate('/portfolio?currency=usd'); await text('$2600.00')
  mark('Portfolio edit, cancel and reload persistence')
  for (const value of ['-1','1e3','0.0000000000000000001','1.2.3']) {
    await fill('Quantity', value); await fill('Price per unit', '100'); await click('Add transaction'); await text('nonnegative decimal'); await count(7)
  }
  await select('SELL'); await fill('Quantity','100'); await fill('Price per unit','100'); await click('Add transaction'); await text('exceeds holdings'); await count(7)
  await fill('Quantity','1'); await fill('Date and time','2024-01-01T00:00'); await click('Add transaction'); await text('exceeds holdings'); await count(7)
  mark('Invalid decimals, negatives, oversell and backdated sell preserve storage')
  accept = false; await click('Delete'); await count(7)
  accept = true; await click('Delete'); await count(6); await text('Transaction deleted')
  mark('Delete confirmation cancel and accept')
  quoteMode = 'missing'; await click('Refresh USD quotes'); await text('Missing USD quotes: bitcoin.'); assert.equal(await ev(`document.querySelector('[aria-label="Portfolio summary"]').children[0].children[1].textContent`),'Unavailable')
  quoteMode = 'fail'; await click('Refresh USD quotes'); await text('USD prices could not be fetched')
  quoteMode = 'ok'; await click('Refresh USD quotes'); await text('USD quotes fetched at')
  mark('SYNTHETIC: missing/failing quotes never render invented zero; refresh recovers')
  const downloadDir = await mkdtemp(join(tmpdir(),'blockdetails-backups-'))
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloadDir})
  await click('Export JSON backup'); await text('Backup download requested')
  let files = []
  for (let i=0;i<30;i++) { files = (await readdir(downloadDir)).filter(f=>f.endsWith('.json')); if(files.length) break; await new Promise(r=>setTimeout(r,100)) }
  assert.equal(files.length,1); const backup = await readFile(join(downloadDir,files[0]),'utf8'); assert.deepEqual(JSON.parse(backup),JSON.parse(await saved()))
  const upload = async raw => {
    const file = join(downloadDir,'restore.json'); await writeFile(file,raw)
    const {root} = await send('DOM.getDocument'); const {nodeId} = await send('DOM.querySelector',{nodeId:root.nodeId,selector:'input[type="file"]'})
    await send('DOM.setFileInputFiles',{nodeId,files:[file]})
  }
  for (const raw of ['{broken', '{"version":2}', JSON.stringify({version:1,currency:'USD',transactions:[{}]})]) {
    await upload(raw); await waitFor(`document.querySelector('[role="alert"]') !== null`); assert.equal(await saved(),backup)
  }
  await upload(backup); await text('Backup restored'); assert.equal(await saved(),backup)
  mark('Actual JSON file download and upload: roundtrip and malformed/schema-invalid preservation')
  await ev(`window.__setItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='${key}')throw new DOMException('Synthetic quota exhausted','QuotaExceededError');return window.__setItem.call(this,k,v)}`)
  await fill('Quantity','1'); await fill('Price per unit','100'); await click('Add transaction'); await text('Synthetic quota exhausted'); assert.equal(await saved(),backup)
  await ev(`Storage.prototype.setItem=window.__setItem;localStorage.setItem('${key}',JSON.stringify({version:1,currency:'USD',transactions:[]}))`)
  await click('Add transaction'); await text('Portfolio changed in another tab'); assert.equal(JSON.parse(await saved()).transactions.length,0)
  await ev(`window.dispatchEvent(new StorageEvent('storage',{key:'${key}'}))`); await text('Local storage changed in another tab'); assert.equal(await ev(`document.querySelector('fieldset').disabled`),true)
  mark('SYNTHETIC: quota failure and concurrent-write conflict preserve newer data')
  await ev(`localStorage.setItem('${key}','{corrupt')`); await navigate('/portfolio?currency=usd'); await text('Local data could not be loaded'); assert.equal(await saved(),'{corrupt')
  await upload(backup); await text('Backup restored'); await count(6)
  mark('Corrupt stored portfolio blocked safely; valid backup recovery')
  await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true}).then(p=>writeFile('/tmp/blockdetails-portfolio.png',Buffer.from(p.data,'base64')))
  // Search is tested via real keyboard input, with deterministic API timing and failures.
  await cssClick('[aria-label="Search assets"]'); await text('Type at least two characters.')
  searchMode='slow'; await send('Input.insertText',{text:'bit'}); await text('Searching...'); await text('Bitcoin')
  await keypress('Escape','Escape'); await waitFor(`!document.querySelector('[role="dialog"]')`)
  await keypress('k','KeyK',2); await waitFor(`document.querySelector('[role="dialog"]') !== null`)
  searchMode='empty'; await send('Input.insertText',{text:'zzzz'}); await text('No results for')
  await ev(`document.querySelector('[role="combobox"][placeholder]').select()`); searchMode='fail'; await send('Input.insertText',{text:'failure'}); await text('Search is temporarily unavailable')
  await ev(`document.querySelector('[role="combobox"][placeholder]').select()`); searchMode='ok'; await send('Input.insertText',{text:'bitcoin'}); await waitFor(`document.querySelector('[role="option"]') !== null`)
  await keypress('ArrowDown','ArrowDown'); await keypress('Enter','Enter'); await waitFor(`location.pathname==='/cryptocurrency/bitcoin' && !document.querySelector('[role="dialog"]')`)
  mark('SYNTHETIC: search click/shortcut, input, loading, empty, failure and keyboard selection')
  await waitFor(`document.querySelector('[aria-label="Chart time range"]') || /unavailable|Unable to load/i.test(document.querySelector('main')?.innerText || '')`)
  if (await ev(`!!document.querySelector('[aria-label="Chart time range"]')`)) {
    for (const [range,days] of [['1D',1],['7D',7],['30D',30],['90D',90],['1Y',365],['5Y',1825]]) {
      await click(range); await waitFor(`!!document.querySelector('.recharts-surface')`); assert.ok(requests.some(url=>url.includes(`days=${days}`)))
    }
    chartMode='fail'; await click('1D'); await text('Chart unavailable for this range'); chartMode='ok'; await click('Try Again'); await waitFor(`!!document.querySelector('.recharts-surface')`)
    chartMode='empty'; await click('7D'); await text('No chart data available'); chartMode='ok'
    mark('SYNTHETIC: all chart ranges, failure/retry and empty')
    await waitFor(`document.querySelector('[aria-label="Add to watchlist"]')?.disabled===false`); await cssClick('[aria-label="Add to watchlist"]')
    mark('Watchlist add from coin detail')
  } else {
    results.push('BLOCKED live provider: coin detail chart/add controls not rendered; NOT a data pass')
    await ev(`localStorage.setItem('blockdetails_watchlist','["bitcoin"]')`)
  }
  await navigate('/watchlist?currency=usd'); await text('Bitcoin'); await navigate('/watchlist?currency=usd'); await text('Bitcoin')
  await cssClick('[aria-label="Remove from watchlist"]'); await text('Your watchlist is empty'); assert.equal(await ev(`localStorage.getItem('blockdetails_watchlist')`),'[]')
  await ev(`localStorage.setItem('blockdetails_watchlist','["bitcoin"]')`); quoteMode='fail'; await navigate('/watchlist?currency=usd'); await text('Unable to load watchlist prices'); assert.equal(await ev(`localStorage.getItem('blockdetails_watchlist')`),'["bitcoin"]')
  quoteMode='ok'; await click('Try Again'); await text('Bitcoin')
  await ev(`localStorage.setItem('blockdetails_watchlist','{corrupt')`); await navigate('/watchlist?currency=usd'); await text('Cannot read your saved watchlist'); assert.equal(await ev(`localStorage.getItem('blockdetails_watchlist')`),'{corrupt')
  await ev(`localStorage.setItem('blockdetails_watchlist','[]')`); await click('Try Again'); await text('Your watchlist is empty')
  mark('SYNTHETIC: watchlist reload/remove/empty, failed quotes retry, corrupt storage preservation')
  await cssClick('[aria-label="Display currency"]'); await waitFor(`document.querySelector('[role="option"]') !== null`)
  await ev(`[...document.querySelectorAll('[role="option"]')].find(e=>e.textContent.includes('EUR')).click()`)
  await waitFor(`location.search.includes('currency=eur')`); assert.equal(await ev(`localStorage.getItem('blockdetails_currency')`),'eur')
  await navigate('/watchlist'); await waitFor(`location.search.includes('currency=eur')`); console.log('Currency trigger observed:',await ev(`document.querySelector('[aria-label="Display currency"]').textContent`)); await waitFor(`document.querySelector('[aria-label="Display currency"]').textContent.includes('EUR')`)
  mark('Currency UI selection, storage persistence and reload URL reconciliation')
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true})
  await cssClick('[aria-label="Open navigation menu"]'); await waitFor(`document.querySelector('[aria-label="Mobile navigation"]') !== null`)
  await ev(`[...document.querySelectorAll('[aria-label="Mobile navigation"] a')].find(e=>e.getAttribute('href').startsWith('/portfolio')).click()`)
  await waitFor(`location.pathname==='/portfolio' && !document.querySelector('[role="dialog"]')`); await text('Add transaction')
  assert.equal(await ev('document.documentElement.scrollWidth <= innerWidth'),true)
  await cssClick('[aria-label="Open navigation menu"]'); await keypress('Escape','Escape'); await waitFor(`!document.querySelector('[role="dialog"]')`)
  await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true}).then(p=>writeFile('/tmp/blockdetails-mobile.png',Buffer.from(p.data,'base64')))
  mark('390px responsive menu navigation/Escape, currency preserved, no horizontal overflow')
}

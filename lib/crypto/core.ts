import type { Category, ChartData, Coin, CryptoClient, Exchange, GlobalMarketData, MarketPair, MarketsOptions, Provider, SearchCoin } from './types'

type Row = Record<string, unknown>
type Query = Record<string, string | number | boolean | undefined>
type Http = (path: string, query?: Query) => Promise<unknown>
type Capability = keyof CryptoClient
export type FailureCode = 'NOT_FOUND' | 'INVALID_INPUT' | 'UNAVAILABLE' | 'UNSUPPORTED' | 'SCHEMA' | 'HTTP' | 'TIMEOUT' | 'NETWORK'
export class CryptoError extends Error {
  code: FailureCode
  status: number
  constructor(code: FailureCode, message: string, status = 503) {
    super(message)
    this.name = 'CryptoError'
    this.code = code
    this.status = status
  }
}
const fail = (message = 'Invalid provider response'): never => { throw new CryptoError('SCHEMA', message) }
const unsupported = (): never => { throw new CryptoError('UNSUPPORTED', 'No compatible provider capability') }
function row(v: unknown): Row {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return fail()
  return v as Row
}
const optionalRow = (v: unknown): Row => v == null ? {} : row(v)
function list(v: unknown): unknown[] { return Array.isArray(v) ? v : fail() }
function text(v: unknown): string { return typeof v === 'string' && v.trim() ? v : fail() }
function optionalText(v: unknown): string | null { return v == null ? null : typeof v === 'string' ? v : fail() }
function number(v: unknown): number { return typeof v === 'number' && Number.isFinite(v) ? v : fail() }
function nullable(v: unknown): number | null { return v == null ? null : number(v) }
function requiredNullable(r: Row, key: string): number | null { return key in r ? nullable(r[key]) : fail(`Missing ${key}`) }
function numericId(v: unknown): number {
  const n = number(v)
  return Number.isSafeInteger(n) && n > 0 ? n : fail('Invalid numeric ID')
}
function url(v: unknown): string | null {
  const s = optionalText(v)
  if (!s) return null
  try { const u = new URL(s); return ['http:', 'https:'].includes(u.protocol) ? u.href : null } catch { return null }
}
function plain(v: unknown): string {
  return (optionalText(v) ?? '').replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '')
    .replace(/<[^>]*>/g, ' ').replace(/&(?:amp|lt|gt|quot|apos|nbsp);|&#(?:x[0-9a-f]+|\d+);/gi, entity => {
      const named: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&nbsp;': ' ' }
      if (named[entity.toLowerCase()]) return named[entity.toLowerCase()]
      const code = entity[2].toLowerCase() === 'x' ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10)
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ''
    }).replace(/\s+/g, ' ').trim()
}
function links(v: unknown): Coin['links'] {
  const out: Coin['links'] = []
  for (const [label, values] of Object.entries(optionalRow(v))) {
    // CMC URLs and CG links both contain arrays; CG also nests repository URLs.
    if (label === 'repos_url') { out.push(...links(values)); continue }
    for (const value of Array.isArray(values) ? values : [values]) {
      if (typeof value !== 'string') continue
      const safe = url(value)
      if (safe && !out.some(item => item.url === safe)) out.push({ label: label.replaceAll('_', ' '), url: safe })
    }
  }
  return out
}
function strings(v: unknown): string[] { return v == null ? [] : list(v).map(text) }

// Explicit, reviewed identities. Keys are CoinGecko IDs (canonical); values are CMC numeric IDs.
// Verified 2026-09-20 against live CG /coins/markets (id field) and CMC /v1/cryptocurrency/map.
// Never symbol/slug-only matching. Add entries only with independently verified provider IDs.
export const coinIds: Readonly<Record<string, number>> = {
  // Native L1s
  bitcoin: 1, ethereum: 1027, solana: 5426, ripple: 52, binancecoin: 1839, cardano: 2010,
  'avalanche-2': 5805, tron: 1958, polkadot: 6636, near: 6535, cosmos: 3794,
  litecoin: 2, dogecoin: 74, monero: 328, stellar: 512, 'internet-computer': 8916,
  'hedera-hashgraph': 4642, sui: 20947, aptos: 21794, blockstack: 4847,
  'injective-protocol': 7226, 'quant-network': 3155, vechain: 3077, dash: 131,
  zcash: 1437, kaspa: 20396, algorand: 4030, 'ethereum-classic': 1321,
  'bitcoin-cash': 1831, 'crypto-com-chain': 3635,
  // Tokens (Ethereum)
  tether: 825, 'usd-coin': 3408, chainlink: 1975, 'shiba-inu': 5994, dai: 4943,
  uniswap: 7083, aave: 7278, 'leo-token': 3957, pepe: 24478, mantle: 27075,
  'render-token': 5690, okb: 3897, 'pancakeswap-token': 7186, arbitrum: 11841,
  filecoin: 2280, 'kucoin-shares': 2087,
  // Tokens (other chains)
  'usd1-wlfi': 36148, 'bitget-token': 11092, 'pump-fun': 36507,
}
// Verified against CMC /v1/exchange/map (v3 API IDs differ from legacy v1 — only confirmed slugs included).
const exchangeIds: Readonly<Record<string, number>> = { binance: 270, okx: 294, bybit: 521, gate: 302, mexc: 544, kucoin: 311, kraken: 24, upbit: 351, bitget: 513, lbank: 333 }
function canonical(n: number, ids = coinIds): string {
  return Object.entries(ids).find(([, value]) => value === n)?.[0] ?? `cmc:${n}`
}
function cmcId(id: string, ids = coinIds): number {
  if (/^cmc:[1-9]\d*$/.test(id)) return numericId(Number(id.slice(4)))
  return Object.hasOwn(ids, id) ? ids[id] : unsupported()
}
function cgId(id: string, ids = coinIds): string {
  if (!id.startsWith('cmc:')) return id
  const mapped = canonical(cmcId(id), ids)
  return mapped.startsWith('cmc:') ? unsupported() : mapped
}
function identifier(id: string): string {
  if (typeof id !== 'string' || id.length > 160 || !/^(?:cmc:[1-9]\d*|[a-z0-9][a-z0-9._-]*)$/.test(id)) {
    throw new CryptoError('INVALID_INPUT', 'Invalid asset identifier', 400)
  }
  return id
}
function currency(value = 'usd'): string {
  if (typeof value !== 'string' || !['usd', 'eur', 'gbp', 'jpy', 'aud', 'php', 'btc', 'eth'].includes(value.toLowerCase())) {
    throw new CryptoError('INVALID_INPUT', 'Unsupported currency', 400)
  }
  return value.toLowerCase()
}
function integer(value: number, max: number): number {
  if (!Number.isSafeInteger(value) || value < 1 || value > max) throw new CryptoError('INVALID_INPUT', 'Invalid pagination or range', 400)
  return value
}
function emptyCoin(r: Row, id: string, provider: Provider): Coin {
  return {
    id, slug: provider === 'coingecko' ? id : optionalText(r.slug) ?? id,
    coingecko_id: id.startsWith('cmc:') ? null : id,
    coinmarketcap_id: provider === 'coinmarketcap' ? numericId(r.id) : coinIds[id] ?? null,
    name: text(r.name), symbol: text(r.symbol), image: null, market_cap_rank: null,
    current_price: null, market_cap: null, total_volume: null, fully_diluted_valuation: null,
    price_change_percentage_1h_in_currency: null, price_change_percentage_24h: null,
    price_change_percentage_7d_in_currency: null, price_change_percentage_30d_in_currency: null,
    price_change_percentage_60d_in_currency: null, price_change_percentage_1y_in_currency: null,
    high_24h: null, low_24h: null, price_change_24h: null, circulating_supply: null,
    total_supply: null, max_supply: null, ath: null, ath_change_percentage: null, ath_date: null,
    atl: null, atl_date: null, last_updated: null, description: '', links: [], platforms: {}, categories: [], provider,
  }
}
const numericFields = ['fully_diluted_valuation', 'high_24h', 'low_24h', 'price_change_24h', 'circulating_supply', 'total_supply', 'max_supply', 'ath', 'ath_change_percentage', 'atl', 'price_change_percentage_1h_in_currency', 'price_change_percentage_7d_in_currency', 'price_change_percentage_30d_in_currency', 'price_change_percentage_60d_in_currency', 'price_change_percentage_1y_in_currency'] as const
function cgCoin(value: unknown, c: string, detail = false): Coin {
  const r = row(value)
  const coin = emptyCoin(r, text(r.id), 'coingecko')
  const m = detail ? row(r.market_data) : r
  const scalar = new Set(['circulating_supply', 'total_supply', 'max_supply'])
  const field = (key: string): unknown => detail && !scalar.has(key) ? optionalRow(m[key])[c] : m[key]
  coin.current_price = number(field('current_price'))
  coin.market_cap = detail ? requiredNullable(row(m.market_cap), c) : requiredNullable(m, 'market_cap')
  coin.total_volume = detail ? requiredNullable(row(m.total_volume), c) : requiredNullable(m, 'total_volume')
  coin.market_cap_rank = nullable(r.market_cap_rank)
  coin.image = url(detail ? optionalRow(r.image).large ?? optionalRow(r.image).small : r.image)
  coin.price_change_percentage_24h = detail ? nullable(optionalRow(m.price_change_percentage_24h_in_currency)[c]) : nullable(m.price_change_percentage_24h)
  for (const key of numericFields) {
    // CG detail uses a currency map for the absolute 24h delta.
    coin[key] = nullable(field(key === 'price_change_24h' && detail ? 'price_change_24h_in_currency' : key))
  }
  coin.ath_date = optionalText(field('ath_date'))
  coin.atl_date = optionalText(field('atl_date'))
  coin.last_updated = optionalText(r.last_updated)
  if (detail) {
    coin.description = plain(optionalRow(r.description).en)
    coin.links = links(r.links)
    coin.categories = strings(r.categories)
    coin.platforms = Object.fromEntries(Object.entries(optionalRow(r.platforms)).filter(([, v]) => v != null && v !== '').map(([k, v]) => [k, text(v)]))
  }
  return coin
}
function quote(r: Row, c: string): Row {
  // v3 quotes use an array; v1 trending/global/exchange use a currency map.
  return Array.isArray(r.quote)
    ? row(r.quote.find(v => row(v).symbol === c.toUpperCase()))
    : row(row(r.quote)[c.toUpperCase()])
}
function cmcCoin(value: unknown, c: string): Coin {
  const r = row(value), q = quote(r, c)
  const coin = emptyCoin(r, canonical(numericId(r.id)), 'coinmarketcap')
  coin.image = url(r.logo)
  coin.market_cap_rank = nullable(r.cmc_rank)
  coin.current_price = number(q.price)
  coin.market_cap = requiredNullable(q, 'market_cap')
  coin.total_volume = requiredNullable(q, 'volume_24h')
  coin.fully_diluted_valuation = nullable(q.fully_diluted_market_cap)
  coin.price_change_percentage_24h = nullable(q.percent_change_24h)
  coin.price_change_percentage_1h_in_currency = nullable(q.percent_change_1h)
  coin.price_change_percentage_7d_in_currency = nullable(q.percent_change_7d)
  coin.price_change_percentage_30d_in_currency = nullable(q.percent_change_30d)
  coin.price_change_percentage_60d_in_currency = nullable(q.percent_change_60d)
  for (const key of ['circulating_supply', 'total_supply', 'max_supply'] as const) coin[key] = nullable(r[key])
  coin.last_updated = optionalText(r.last_updated)
  // Do not derive ATH, daily high/low or absolute price change from unrelated fields.
  return coin
}
function cgSearch(v: unknown): SearchCoin {
  const r = row(v)
  return { id: text(r.id), symbol: text(r.symbol), name: text(r.name), image: url(r.large ?? r.thumb), market_cap_rank: nullable(r.market_cap_rank) }
}
function cgPair(value: unknown): MarketPair {
  const r = row(value), market = row(r.market), volume = optionalRow(r.converted_volume)
  const base = text(r.base), target = text(r.target)
  return { market_id: text(market.identifier), market_name: text(market.name), base, quote: target,
    base_symbol: base, quote_symbol: target, last_price: requiredNullable(r, 'last'),
    volume_24h_usd: nullable(volume.usd), volume_btc_24h: nullable(volume.btc), trust_score: optionalText(r.trust_score), trade_url: url(r.trade_url) }
}
function cgExchange(value: unknown, id?: string): Exchange {
  const r = row(value)
  return { id: id ?? text(r.id), name: text(r.name), image: url(r.image), trust_score: nullable(r.trust_score),
    trust_score_rank: nullable(r.trust_score_rank), trade_volume_24h_btc: requiredNullable(r, 'trade_volume_24h_btc'),
    coins: nullable(r.coins), pairs: nullable(r.pairs), year_established: nullable(r.year_established), country: optionalText(r.country),
    description: plain(r.description), url: url(r.url), market_center_url: url(r.market_center_url), provider: 'coingecko' }
}
function cmcExchange(value: unknown): Exchange {
  const r = row(value)
  return { id: canonical(numericId(r.id), exchangeIds), name: text(r.name), image: url(r.logo), trust_score: null,
    trust_score_rank: null, trade_volume_24h_btc: requiredNullable(quote(r, 'btc'), 'volume_24h'),
    coins: nullable(r.num_coins), pairs: nullable(r.num_market_pairs), year_established: null, country: null,
    description: plain(r.description), url: null, market_center_url: null, provider: 'coinmarketcap' }
}
function cmcPair(value: unknown, exchange?: { id: string; name: string }): MarketPair {
  const r = row(value), q = row(r.quote), usd = row(q.USD), reported = optionalRow(q.exchange_reported)
  const base = text(row(r.market_pair_base).currency_symbol), target = text(row(r.market_pair_quote).currency_symbol)
  const market = exchange ?? { id: canonical(numericId(row(r.exchange).id), exchangeIds), name: text(row(r.exchange).name) }
  return { market_id: market.id, market_name: market.name, base, quote: target, base_symbol: base, quote_symbol: target,
    last_price: nullable(reported.price), volume_24h_usd: requiredNullable(usd, 'volume_24h'), volume_btc_24h: null,
    trust_score: null, trade_url: url(r.market_url) }
}
function chart(points: unknown): ChartData {
  const prices: [number, number][] = list(points).map(v => {
    const p = list(v)
    if (p.length !== 2 || number(p[0]) < 0 || number(p[1]) < 0) return fail()
    return [number(p[0]), number(p[1])]
  })
  if (!prices.length) return fail('No chart quotes available')
  if (prices.some((p, i) => i > 0 && p[0] <= prices[i - 1][0])) return fail('Unordered chart timestamps')
  return { prices }
}
function requireIds<T extends { id: string }>(values: T[], ids: string[]): T[] {
  if (ids.some(id => !values.some(v => v.id === id))) return fail('Missing requested asset')
  return values
}
function sortCoins(coins: Coin[], order: string): Coin[] {
  const asc = order.endsWith('_asc') ? 1 : -1
  return coins.sort((a, b) => order.startsWith('id_') ? asc * a.id.localeCompare(b.id) :
    asc * ((order.startsWith('volume_') ? a.total_volume : a.market_cap) ?? -Infinity) - asc * ((order.startsWith('volume_') ? b.total_volume : b.market_cap) ?? -Infinity))
}

function coingecko(http: Http): CryptoClient {
  return {
    async getMarkets({ currency: c = 'usd', page = 1, perPage = 50, order = 'market_cap_desc', ids, category }: MarketsOptions = {}) {
      const mapped = ids?.map(id => cgId(id))
      let data = list(await http('/coins/markets', { vs_currency: c, page: mapped ? 1 : page, per_page: mapped ? mapped.length : perPage, order, ids: mapped?.join(','), category,
        sparkline: false, price_change_percentage: '1h,24h,7d,30d,1y' })).map(v => cgCoin(v, c))
      // A requested ID silently omitted by CG is not a successful quote response.
      if (mapped) data = sortCoins(requireIds(data, mapped), order).slice((page - 1) * perPage, page * perPage)
      return data.map(coin => ({ ...coin, id: ids?.find(id => cgId(id) === coin.id) ?? coin.id }))
    },
    async getCoin(id, c = 'usd') {
      const target = cgId(id)
      const coin = cgCoin(await http(`/coins/${encodeURIComponent(target)}`, { localization: false, tickers: false, market_data: true, community_data: false, developer_data: false }), c, true)
      if (coin.id !== target) return fail('Mismatched asset')
      return coin
    },
    async getChart(id, c = 'usd', days = 7) {
      return chart(row(await http(`/coins/${encodeURIComponent(cgId(id))}/market_chart`, { vs_currency: c, days })).prices)
    },
    async getGlobal(c = 'usd'): Promise<GlobalMarketData> {
      const r = row(row(await http('/global')).data)
      return { total_market_cap: { [c]: number(row(r.total_market_cap)[c]) }, total_volume: { [c]: number(row(r.total_volume)[c]) },
        market_cap_percentage: { btc: number(row(r.market_cap_percentage).btc), eth: nullable(row(r.market_cap_percentage).eth) },
        active_cryptocurrencies: requiredNullable(r, 'active_cryptocurrencies'), market_cap_change_percentage_24h_usd: nullable(r.market_cap_change_percentage_24h_usd), provider: 'coingecko' }
    },
    async getTrending(c = 'usd') {
      const items = list(row(await http('/search/trending')).coins).map(v => row(row(v).item))
      const ids = items.map(r => text(r.id))
      if (!ids.length) return fail('Missing trending assets')
      const quotes = list(await http('/coins/markets', { vs_currency: c, ids: ids.join(','), per_page: 250, page: 1, price_change_percentage: '1h,24h,7d' })).map(v => cgCoin(v, c))
      requireIds(quotes, ids)
      return ids.map(id => quotes.find(q => q.id === id)!)
    },
    async searchCoins(query) { return list(row(await http('/search', { query })).coins).map(cgSearch) },
    async getExchanges(page = 1, perPage = 50) {
      return list(await http('/exchanges', { page, per_page: perPage })).map(v => cgExchange(v))
    },
    async getExchange(id) {
      const target = cgId(id, exchangeIds), r = row(await http(`/exchanges/${encodeURIComponent(target)}`))
      return { exchange: cgExchange(r, target), pairs: list(r.tickers).map(cgPair) }
    },
    async getExchangeMarkets(id, page = 1) {
      return list(row(await http(`/exchanges/${encodeURIComponent(cgId(id, exchangeIds))}/tickers`, { page })).tickers).map(cgPair)
    },
    async getCoinMarkets(id, page = 1) {
      return list(row(await http(`/coins/${encodeURIComponent(cgId(id))}/tickers`, { page })).tickers).map(cgPair)
    },
    async getCategories(): Promise<Category[]> {
      return list(await http('/coins/categories/list')).map(v => { const r = row(v); return { id: text(r.category_id), name: text(r.name) } })
    },
  }
}
function coinmarketcap(http: Http): CryptoClient {
  const quotes = async (ids: number[], c: string) => {
    const coins = list(await http('/v3/cryptocurrency/quotes/latest', { id: ids.join(','), convert: c.toUpperCase(), skip_invalid: false })).map(v => cmcCoin(v, c))
    return requireIds(coins, ids.map(id => canonical(id)))
  }
  const pairs = async (id: string, page: number, exchange: boolean) => {
    const n = cmcId(id, exchange ? exchangeIds : coinIds)
    const r = row(await http(exchange ? '/v1/exchange/market-pairs/latest' : '/v2/cryptocurrency/market-pairs/latest', { id: n, start: (page - 1) * 100 + 1, limit: 100, convert: 'USD' }))
    if (numericId(r.id) !== n) return fail('Mismatched market identity')
    return list(r.market_pairs).map(v => cmcPair(v, exchange ? { id: canonical(n, exchangeIds), name: text(r.name) } : undefined))
  }
  return {
    async getMarkets({ currency: c = 'usd', page = 1, perPage = 50, order = 'market_cap_desc', ids, category }: MarketsOptions = {}) {
      if (category) return unsupported() // CG and CMC category taxonomies are not interchangeable.
      if (ids) return sortCoins(await quotes(ids.map(id => cmcId(id)), c), order).slice((page - 1) * perPage, page * perPage).map(coin => ({ ...coin, id: ids.find(id => canonical(cmcId(id)) === coin.id) ?? coin.id }))
      if (order.startsWith('id_')) return unsupported() // CMC does not sort listings by CG IDs.
      return list(await http('/v3/cryptocurrency/listings/latest', { start: (page - 1) * perPage + 1, limit: perPage, convert: c.toUpperCase(), sort: order.startsWith('volume_') ? 'volume_24h' : 'market_cap', sort_dir: order.endsWith('_asc') ? 'asc' : 'desc' })).map(v => cmcCoin(v, c))
    },
    async getCoin(id, c = 'usd') {
      const n = cmcId(id)
      const [coins, metadata] = await Promise.all([quotes([n], c), http('/v2/cryptocurrency/info', { id: n })])
      const coin = coins[0], info = row(row(metadata)[String(n)])
      if (numericId(info.id) !== n) return fail('Mismatched metadata')
      coin.description = plain(info.description)
      coin.image = url(info.logo)
      coin.links = links(info.urls)
      coin.categories = strings(info.tags)
      const platform = optionalRow(info.platform)
      if (platform.id != null && platform.token_address) coin.platforms[canonical(numericId(platform.id))] = text(platform.token_address)
      return coin
    },
    async getChart(id, c = 'usd', days = 7) {
      const n = cmcId(id)
      // Stable minute boundary avoids a new cache key on every render. Never synthesize candles.
      const end = Math.floor(Date.now() / 60_000) * 60
      const r = row(await http('/v3/cryptocurrency/quotes/historical', { id: n, convert: c.toUpperCase(), time_start: end - days * 86400, time_end: end, interval: days <= 1 ? '5m' : days <= 30 ? 'hourly' : 'daily', count: 10000, skip_invalid: false }))
      if (numericId(r.id) !== n) return fail('Mismatched chart identity')
      return chart(list(r.quotes).map(v => { const p = row(v); return [Date.parse(text(p.timestamp)), number(quote(p, c).price)] }))
    },
    async getGlobal(c = 'usd'): Promise<GlobalMarketData> {
      const r = row(await http('/v1/global-metrics/quotes/latest', { convert: c.toUpperCase() })), q = quote(r, c)
      return { total_market_cap: { [c]: number(q.total_market_cap) }, total_volume: { [c]: number(q.total_volume_24h) },
        market_cap_percentage: { btc: number(r.btc_dominance), eth: nullable(r.eth_dominance) },
        active_cryptocurrencies: requiredNullable(r, 'active_cryptocurrencies'), market_cap_change_percentage_24h_usd: c === 'usd' ? nullable(q.total_market_cap_yesterday_percentage_change) : null, provider: 'coinmarketcap' }
    },
    async getTrending(c = 'usd') {
      const coins = list(await http('/v1/cryptocurrency/trending/latest', { limit: 15, convert: c.toUpperCase(), time_period: '24h' })).map(v => cmcCoin(v, c))
      return coins.length ? coins : fail('Missing trending assets')
    },
    // No official server-side substring search, and a partial 5000-item map is not search.
    async searchCoins() { return unsupported() },
    async getExchanges(page = 1, perPage = 50) {
      return list(await http('/v1/exchange/listings/latest', { start: (page - 1) * perPage + 1, limit: perPage, sort: 'volume_24h', sort_dir: 'desc', convert: 'BTC' })).map(cmcExchange)
    },
    async getExchange(id) {
      const n = cmcId(id, exchangeIds)
      const [data, metadata, markets] = await Promise.all([
        http('/v1/exchange/quotes/latest', { id: n, convert: 'BTC' }), http('/v1/exchange/info', { id: n }), pairs(id, 1, true),
      ])
      const r = row(row(data)[String(n)]), info = row(row(metadata)[String(n)])
      if (numericId(r.id) !== n || numericId(info.id) !== n) return fail('Mismatched exchange identity')
      const exchange = cmcExchange(r)
      exchange.description = plain(info.description)
      exchange.image = url(info.logo)
      exchange.url = links(info.urls).find(link => link.label === 'website')?.url ?? null
      const launched = optionalText(info.date_launched)
      exchange.year_established = launched && Number.isFinite(Date.parse(launched)) ? new Date(launched).getUTCFullYear() : null
      return { exchange, pairs: markets }
    },
    getExchangeMarkets: (id, page = 1) => pairs(id, page, true),
    getCoinMarkets: (id, page = 1) => pairs(id, page, false),
    async getCategories() { return unsupported() },
  }
}

/** Compatible capability dispatch. Missing keys/plans are unavailable, never fake success. */
export const capabilities: Record<Provider, readonly Capability[]> = {
  coingecko: ['getMarkets', 'getCoin', 'getChart', 'getGlobal', 'getTrending', 'searchCoins', 'getExchanges', 'getExchange', 'getExchangeMarkets', 'getCoinMarkets', 'getCategories'],
  coinmarketcap: ['getMarkets', 'getCoin', 'getChart', 'getGlobal', 'getTrending', 'getExchanges', 'getExchange', 'getExchangeMarkets', 'getCoinMarkets'],
}
export interface ClientOptions {
  onFailure?: (provider: Provider, capability: Capability, code: FailureCode, status: number) => void
  primary?: Provider
  fetch?: typeof globalThis.fetch
  coinmarketcapKey?: string
  coingeckoDemoKey?: string
  coingeckoProKey?: string
  timeoutMs?: number
  cacheMs?: number
}
export function createCryptoClient(options: ClientOptions = {}): CryptoClient {
  const fetcher = options.fetch ?? globalThis.fetch
  const timeout = Math.min(Math.max(options.timeoutMs ?? 6000, 1), 10000)
  const ttl = Math.min(Math.max(options.cacheMs ?? 60_000, 0), 300_000)
  // ponytail: bounded per-process cache; a shared cache is only needed across replicas.
  const cache = new Map<string, { until: number; promise: Promise<unknown> }>()
  async function dispatch<T>(key: Capability, args: unknown[], call: (client: CryptoClient) => Promise<T>): Promise<T> {
    const cacheKey = JSON.stringify([key, args]), cached = cache.get(cacheKey)
    if (cached && cached.until > Date.now()) return cached.promise as Promise<T>
    const attempt = async (): Promise<T> => {
      const failures: unknown[] = []
      const order: Provider[] = options.primary === 'coinmarketcap' ? ['coinmarketcap', 'coingecko'] : ['coingecko', 'coinmarketcap']
      for (const provider of order) {
        if (!capabilities[provider].includes(key)) continue
        const controller = new AbortController()
        let timer: ReturnType<typeof setTimeout> | undefined
        const deadline = new Promise<never>((_, reject) => {
          timer = setTimeout(() => { controller.abort(); reject(new CryptoError('TIMEOUT', 'Provider timed out')) }, timeout)
        })
        const http: Http = async (path, query = {}) => {
          const keyless = provider === 'coinmarketcap' && !options.coinmarketcapKey
          if (keyless && !['/v3/cryptocurrency/listings/latest', '/v3/cryptocurrency/quotes/latest', '/v2/cryptocurrency/info', '/v1/global-metrics/quotes/latest'].includes(path)) return unsupported()
          const base = provider === 'coingecko' ? (options.coingeckoProKey ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3') : `https://pro-api.coinmarketcap.com${keyless ? '/public-api' : ''}`
          const endpoint = new URL(base + path)
          for (const [name, value] of Object.entries(query)) if (value !== undefined) endpoint.searchParams.set(name, String(value))
          const headers: Record<string, string> = { Accept: 'application/json' }
          if (provider === 'coinmarketcap' && options.coinmarketcapKey) headers['X-CMC_PRO_API_KEY'] = options.coinmarketcapKey
          if (provider === 'coingecko' && options.coingeckoProKey) headers['x-cg-pro-api-key'] = options.coingeckoProKey
          else if (provider === 'coingecko' && options.coingeckoDemoKey) headers['x-cg-demo-api-key'] = options.coingeckoDemoKey
          // Cache only validated, normalized successes below. Raw 200 error envelopes must not stick.
          const response = await fetcher(endpoint.href, { headers, signal: controller.signal, cache: 'no-store' })
          if (!response.ok) throw new CryptoError('HTTP', `Provider HTTP ${response.status}`, response.status)
          const body: unknown = await response.json()
          if (provider === 'coinmarketcap') {
            const envelope = row(body), status = row(envelope.status)
            if (status.error_code !== 0 && status.error_code !== '0') throw new CryptoError('HTTP', 'Provider rejected request')
            if (!('data' in envelope)) return fail('Missing data envelope')
            return envelope.data
          }
          // CG may return error/status envelopes with HTTP 200 (quota/key failures).
          if (body && !Array.isArray(body) && typeof body === 'object' && ('error' in body || 'status' in body)) return fail('Provider error envelope')
          return body
        }
        try { return await Promise.race([call(provider === 'coingecko' ? coingecko(http) : coinmarketcap(http)), deadline]) }
        catch (error) {
          if (error instanceof CryptoError && error.code === 'INVALID_INPUT') throw error
          failures.push(error)
          options.onFailure?.(provider, key, error instanceof CryptoError ? error.code : 'NETWORK', error instanceof CryptoError ? error.status : 503)
          // Includes 429, all 5xx, quotas/plans, unsupported IDs, parse/schema and network failures.
          // Never expose provider responses, URLs or credential-bearing errors to clients.
        } finally { clearTimeout(timer); controller.abort() }
      }
      if (failures.some(e => e instanceof CryptoError && e.status === 404) && failures.every(e => e instanceof CryptoError && (e.status === 404 || e.code === 'UNSUPPORTED'))) {
        throw new CryptoError('NOT_FOUND', 'Asset or exchange not found', 404)
      }
      throw new CryptoError('UNAVAILABLE', `Crypto data unavailable for ${key}`)
    }
    const entry = { until: Date.now() + Math.max(ttl, timeout * 2), promise: Promise.resolve() as Promise<unknown> }
    entry.promise = attempt().then(result => { entry.until = Date.now() + ttl; return result }).catch(error => {
      if (cache.get(cacheKey) === entry) cache.delete(cacheKey)
      throw error
    })
    if (cache.size >= 128) cache.delete(cache.keys().next().value!)
    cache.set(cacheKey, entry)
    return entry.promise as Promise<T>
  }
  return {
    async getMarkets(input = {}) {
      const c = currency(input.currency), page = integer(input.page ?? 1, 10000), perPage = integer(input.perPage ?? 50, 250)
      const order = input.order ?? 'market_cap_desc'
      if (!['market_cap_desc', 'market_cap_asc', 'volume_desc', 'volume_asc', 'id_asc', 'id_desc'].includes(order)) throw new CryptoError('INVALID_INPUT', 'Invalid market order', 400)
      const ids = input.ids == null ? undefined : [...new Set(input.ids.map(identifier))]
      if (ids && ids.length > 250) throw new CryptoError('INVALID_INPUT', 'At most 250 IDs per request', 400)
      if (ids && !ids.length) return []
      const category = input.category ? identifier(input.category) : undefined
      if (category && ids) throw new CryptoError('INVALID_INPUT', 'Category and IDs cannot be combined', 400)
      const args = { currency: c, page, perPage, order, ids, category }
      return dispatch('getMarkets', [args], p => p.getMarkets(args))
    },
    async getCoin(id, c) { id = identifier(id); c = currency(c); return dispatch('getCoin', [id, c], async p => ({ ...await p.getCoin(id, c), id })) },
    async getChart(id, c, days = 7) { id = identifier(id); c = currency(c); integer(days, 3650); return dispatch('getChart', [id, c, days], p => p.getChart(id, c, days)) },
    async getGlobal(c) { c = currency(c); return dispatch('getGlobal', [c], p => p.getGlobal(c)) },
    async getTrending(c) { c = currency(c); return dispatch('getTrending', [c], p => p.getTrending(c)) },
    async searchCoins(query) {
      if (typeof query !== 'string' || query.length > 100) throw new CryptoError('INVALID_INPUT', 'Invalid search query', 400)
      query = query.trim()
      return query.length < 2 ? [] : dispatch('searchCoins', [query], p => p.searchCoins(query))
    },
    async getExchanges(page = 1, perPage = 50) { integer(page, 10000); integer(perPage, 250); return dispatch('getExchanges', [page, perPage], p => p.getExchanges(page, perPage)) },
    async getExchange(id) { id = identifier(id); return dispatch('getExchange', [id], p => p.getExchange(id)) },
    async getExchangeMarkets(id, page = 1) { id = identifier(id); integer(page, 10000); return dispatch('getExchangeMarkets', [id, page], p => p.getExchangeMarkets(id, page)) },
    async getCoinMarkets(id, page = 1) { id = identifier(id); integer(page, 10000); return dispatch('getCoinMarkets', [id, page], p => p.getCoinMarkets(id, page)) },
    getCategories() { return dispatch('getCategories', [], p => p.getCategories()) },
  }
}

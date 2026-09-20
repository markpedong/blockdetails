// Multi-portfolio data model for BlockDetails.
// Supports multiple portfolios, each with its own transactions.
// Migrates single-portfolio v1 data to a default portfolio on first load.

export const TRANSACTION_TYPES = ['BUY', 'SELL', 'TRANSFER_IN', 'TRANSFER_OUT', 'REWARD', 'AIRDROP', 'STAKING_REWARD'] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export type PortfolioTransaction = {
  id: string
  type: TransactionType
  assetId: string
  quantity: string
  price: string
  fees: string
  date: string
  notes: string
}

export type Portfolio = {
  id: string
  name: string
  color: string
  createdAt: string
}

export type PortfolioData = {
  version: 2
  portfolios: Portfolio[]
  transactions: Record<string, PortfolioTransaction[]>  // keyed by portfolio id
}

export const PORTFOLIO_KEY = 'blockdetails_portfolio_v2'
export const PORTFOLIO_KEY_V1 = 'blockdetails_portfolio_v1'
export const QUANTITY_SCALE = 18
export const MONEY_SCALE = 36
const ZERO = BigInt(0)
const TEN = BigInt(10)
const Q = TEN ** BigInt(QUANTITY_SCALE)
const MAX_TRANSACTIONS = 5000
export const MAX_BACKUP_BYTES = 8_000_000

// Portfolio colors for visual identification
export const PORTFOLIO_COLORS = [
  '#f97316', // orange
  '#3b82f6', // blue
  '#22c55e', // green
  '#a855f7', // purple
  '#ec4899', // pink
  '#eab308', // yellow
  '#06b6d4', // cyan
  '#ef4444', // red
]

// --- Decimal arithmetic (preserved from v1) ---

function decimal(value: unknown, label: string): bigint {
  if (typeof value !== 'string' || !/^(0|[1-9]\d{0,23})(\.\d{1,18})?$/.test(value)) {
    throw new Error(`${label} must be a nonnegative decimal string (up to 24 integer and 18 fractional digits).`)
  }
  const [whole, fraction = ''] = value.split('.')
  return BigInt(whole) * Q + BigInt(fraction.padEnd(18, '0'))
}

export function formatUnits(value: bigint, scale: number, places = 2): string {
  const negative = value < ZERO
  const absolute = negative ? -value : value
  const divisor = TEN ** BigInt(scale - places)
  const rounded = (absolute + divisor / BigInt(2)) / divisor
  const text = rounded.toString().padStart(places + 1, '0')
  return `${negative && rounded !== ZERO ? '-' : ''}${places ? `${text.slice(0, -places)}.${text.slice(-places)}` : text}`
}

function percent(value: bigint, total: bigint): string | null {
  return total > ZERO ? formatUnits(value * BigInt(1000000) / total, 4, 2) : null
}

// --- Validation ---

export function validateTransactions(input: unknown): PortfolioTransaction[] {
  if (!Array.isArray(input) || input.length > MAX_TRANSACTIONS) throw new Error(`Portfolio must contain at most ${MAX_TRANSACTIONS} transactions.`)
  const ids = new Set<string>()
  return input.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Invalid transaction.')
    const t = item as Record<string, unknown>
    if (typeof t.id !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(t.id)) throw new Error('Invalid transaction ID.')
    if (ids.has(t.id)) throw new Error('Duplicate transaction ID.')
    ids.add(t.id)
    if (typeof t.assetId !== 'string' || !/^(?:[a-z0-9][a-z0-9-]{0,99}|cmc:\d{1,12})$/.test(t.assetId)) throw new Error('Use a canonical asset ID, for example bitcoin or ethereum.')
    if (!TRANSACTION_TYPES.includes(t.type as TransactionType)) throw new Error('Unknown transaction type.')
    if (decimal(t.quantity, 'Quantity') <= ZERO) throw new Error('Quantity must be greater than zero.')
    const price = decimal(t.price, 'Price')
    decimal(t.fees, 'Fees')
    if (!['BUY', 'SELL', 'TRANSFER_IN'].includes(t.type as string) && price !== ZERO) throw new Error('Rewards and outgoing transfers require a zero price.')
    if (typeof t.date !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(t.date) || !Number.isFinite(Date.parse(t.date)) || new Date(t.date).toISOString() !== t.date) throw new Error('Invalid UTC transaction date.')
    if (typeof t.notes !== 'string' || t.notes.length > 1000) throw new Error('Notes must be at most 1000 characters.')
    return { id: t.id, assetId: t.assetId, type: t.type as TransactionType, quantity: t.quantity as string, price: t.price as string, fees: t.fees as string, date: t.date, notes: t.notes }
  })
}

function quoteUnits(value: unknown): bigint | null {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) return null
    const [mantissa, exponent] = String(value).split('e')
    if (exponent) {
      const [whole, fraction = ''] = mantissa.split('.')
      const digits = whole + fraction
      const point = whole.length + Number(exponent)
      value = point <= 0 ? `0.${'0'.repeat(-point)}${digits}` : point >= digits.length ? digits + '0'.repeat(point - digits.length) : `${digits.slice(0, point)}.${digits.slice(point)}`
    } else value = mantissa
  }
  try { return decimal(value, 'Quote') } catch { return null }
}

// --- Portfolio calculations ---

export type PortfolioHolding = {
  assetId: string
  quantity: bigint
  cost: bigint
  realized: bigint
  averageCost: bigint
  marketValue: bigint | null
  unrealized: bigint | null
  allocation: string | null
}

export type PortfolioSummary = {
  holdings: PortfolioHolding[]
  cost: bigint
  realized: bigint
  marketValue: bigint | null
  unrealized: bigint | null
  totalProfit: bigint | null
  trackedCost: bigint
  profitPercent: string | null
  missingPrices: string[]
}

export function calculatePortfolio(input: readonly PortfolioTransaction[], quotes: Record<string, unknown> = {}): PortfolioSummary {
  const transactions = validateTransactions(input)
  const positions = new Map<string, { assetId: string; quantity: bigint; cost: bigint; realized: bigint }>()
  let trackedCost = ZERO
  for (const t of transactions.map((t, order) => ({ ...t, order })).sort((a, b) => a.date.localeCompare(b.date) || a.order - b.order)) {
    const position = positions.get(t.assetId) ?? { assetId: t.assetId, quantity: ZERO, cost: ZERO, realized: ZERO }
    const quantity = decimal(t.quantity, 'Quantity')
    const gross = quantity * decimal(t.price, 'Price')
    const fees = decimal(t.fees, 'Fees') * Q
    if (t.type === 'SELL' || t.type === 'TRANSFER_OUT') {
      if (quantity > position.quantity) throw new Error(`${t.assetId}: ${t.type.replaceAll('_', ' ')} on ${t.date} exceeds holdings at that time.`)
      const removedCost = quantity === position.quantity ? position.cost : position.cost * quantity / position.quantity
      position.quantity -= quantity
      position.cost -= removedCost
      if (t.type === 'SELL') position.realized += gross - fees - removedCost
      else {
        position.realized -= fees
        trackedCost += fees - removedCost
      }
    } else {
      position.quantity += quantity
      position.cost += gross + fees
      trackedCost += gross + fees
    }
    positions.set(t.assetId, position)
  }
  const holdings: PortfolioHolding[] = [...positions.values()].sort((a, b) => a.assetId.localeCompare(b.assetId)).map(p => {
    const quote = quoteUnits(quotes[p.assetId])
    const marketValue = p.quantity === ZERO ? ZERO : quote === null ? null : p.quantity * quote
    return { ...p, averageCost: p.quantity > ZERO ? p.cost * Q / p.quantity : ZERO, marketValue, unrealized: marketValue === null ? null : marketValue - p.cost, allocation: null }
  })
  const cost = holdings.reduce((sum, p) => sum + p.cost, ZERO)
  const realized = holdings.reduce((sum, p) => sum + p.realized, ZERO)
  const missingPrices = holdings.filter(p => p.marketValue === null).map(p => p.assetId)
  const marketValue = missingPrices.length ? null : holdings.reduce((sum, p) => sum + (p.marketValue ?? ZERO), ZERO)
  const unrealized = marketValue === null ? null : marketValue - cost
  const totalProfit = unrealized === null ? null : realized + unrealized
  for (const p of holdings) p.allocation = marketValue !== null && p.marketValue !== null ? percent(p.marketValue, marketValue) : null
  return { holdings, cost, realized, marketValue, unrealized, totalProfit, trackedCost, profitPercent: totalProfit === null ? null : percent(totalProfit, trackedCost), missingPrices }
}

// --- Serialization ---

export function serializePortfolioData(data: PortfolioData): string {
  // Validate all transactions before serializing
  for (const [pid, txs] of Object.entries(data.transactions)) {
    validateTransactions(txs)
    calculatePortfolio(txs)
  }
  return JSON.stringify(data, null, 2)
}

export function parsePortfolioData(raw: string): PortfolioData {
  if (raw.length > MAX_BACKUP_BYTES) throw new Error('Backup is too large (8 MB maximum).')
  let parsed: unknown
  try { parsed = JSON.parse(raw) } catch { throw new Error('Portfolio contains invalid JSON.') }
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid portfolio backup.')
  const data = parsed as Record<string, unknown>
  if (data.version !== 2) throw new Error('Only version 2 portfolio backups are supported.')
  if (!Array.isArray(data.portfolios) || !data.portfolios.every(p => p && typeof p === 'object' && typeof p.id === 'string' && typeof p.name === 'string')) {
    throw new Error('Invalid portfolios in backup.')
  }
  if (!data.transactions || typeof data.transactions !== 'object') throw new Error('Invalid transactions in backup.')
  for (const txs of Object.values(data.transactions)) validateTransactions(txs)
  return parsed as PortfolioData
}

// --- Migration from v1 ---

function parseV1Transactions(raw: string): PortfolioTransaction[] {
  if (raw.length > MAX_BACKUP_BYTES) throw new Error('Backup is too large (8 MB maximum).')
  let data: unknown
  try { data = JSON.parse(raw) } catch { throw new Error('Portfolio contains invalid JSON. Original data has not been changed.') }
  if (!data || typeof data !== 'object') throw new Error('Invalid portfolio backup.')
  const envelope = data as Record<string, unknown>
  if (envelope.version !== 1 || envelope.currency !== 'USD') throw new Error('Only version 1 USD portfolio backups are supported.')
  const transactions = validateTransactions(envelope.transactions)
  calculatePortfolio(transactions)
  return transactions
}

export function migrateV1ToV2(storage: Pick<Storage, 'getItem' | 'removeItem'>): PortfolioData | null {
  const v1Raw = storage.getItem(PORTFOLIO_KEY_V1)
  if (v1Raw === null) return null
  const transactions = parseV1Transactions(v1Raw)
  const defaultPortfolio: Portfolio = {
    id: crypto.randomUUID(),
    name: 'My Portfolio',
    color: PORTFOLIO_COLORS[0],
    createdAt: new Date().toISOString(),
  }
  storage.removeItem(PORTFOLIO_KEY_V1)
  return {
    version: 2,
    portfolios: [defaultPortfolio],
    transactions: { [defaultPortfolio.id]: transactions },
  }
}

// --- Load / Save ---

export function loadPortfolioData(storage: Pick<Storage, 'getItem' | 'removeItem'>): { data: PortfolioData; raw: string | null } {
  // Try migration first
  const migrated = migrateV1ToV2(storage)
  if (migrated) {
    const raw = serializePortfolioData(migrated)
    return { data: migrated, raw }
  }
  const raw = storage.getItem(PORTFOLIO_KEY)
  if (raw === null) return { data: { version: 2, portfolios: [], transactions: {} }, raw: null }
  return { data: parsePortfolioData(raw), raw }
}

export function savePortfolioData(storage: Pick<Storage, 'getItem' | 'setItem'>, data: PortfolioData, expectedRaw: string | null): string {
  const raw = serializePortfolioData(data)
  if (storage.getItem(PORTFOLIO_KEY) !== expectedRaw) throw new Error('Portfolio changed in another tab. Reload before making changes.')
  storage.setItem(PORTFOLIO_KEY, raw)
  return raw
}

// --- Helpers for portfolio management ---

export function createPortfolio(name: string, colorIndex = 0): Portfolio {
  return {
    id: crypto.randomUUID(),
    name,
    color: PORTFOLIO_COLORS[colorIndex % PORTFOLIO_COLORS.length],
    createdAt: new Date().toISOString(),
  }
}

export function getPortfolioTransactions(data: PortfolioData, portfolioId: string): PortfolioTransaction[] {
  return data.transactions[portfolioId] ?? []
}

// Aggregate holdings across all portfolios (for Overview mode)
export function aggregateHoldings(
  data: PortfolioData,
  quotes: Record<string, unknown>
): PortfolioSummary {
  const allTxs: PortfolioTransaction[] = []
  for (const txs of Object.values(data.transactions)) {
    allTxs.push(...txs)
  }
  return calculatePortfolio(allTxs, quotes)
}

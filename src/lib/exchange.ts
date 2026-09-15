import { fetchCG } from './api'

export interface ExchangeMarket {
  base: string
  quote: string
  last?: number
  total_volume?: { usd?: number }
  trust_score?: string | number
}

export interface ExchangeDetail {
  id: string
  name: string
  image: string
  trust_score: number
  trust_score_label?: string
  established: number
  markets?: number
  total_24h_volume?: Record<string, number>
  reported_volume_24h_usd?: number
  trading_volume_score?: number
  urls?: { website?: string[]; twitter_username?: string; subreddit_url?: string }
  description?: { en: string }
}

export interface ExchangeSummary {
  id: string
  name: string
  image: string
  market_identifier?: number
  trust_score: string | number
  markets?: number
  total_24h_volume?: Record<string, number>
}

const CG = process.env.NEXT_PUBLIC_COINGECKO || 'https://api.coingecko.com/api/v3'

export async function getExchanges(): Promise<ExchangeSummary[]> {
  const res = await fetch(`${CG}/exchanges?order=volume_24h_usd_desc&per_page=50&page=1`)
  if (!res.ok) return []
  return res.json() as Promise<ExchangeSummary[]>
}

export async function getExchangeDetail(id: string): Promise<ExchangeDetail | null> {
  try {
    const res = await fetch(`${CG}/exchanges/${id}`)
    if (!res.ok) return null
    return res.json() as Promise<ExchangeDetail>
  } catch {
    return null
  }
}

export async function getExchangeMarkets(id: string): Promise<ExchangeMarket[]> {
  try {
    const res = await fetch(`${CG}/exchanges/${id}/markets?per_page=50`)
    if (!res.ok) return []
    return res.json() as Promise<ExchangeMarket[]>
  } catch {
    return []
  }
}

export async function getExchangeList(): Promise<{ id: string; name: string }[]> {
  try {
    const res = await fetch(`${CG}/exchanges?per_page=50`)
    if (!res.ok) return []
    const data = await res.json()
    return (data as { id: string; name: string }[]).slice(0, 30)
  } catch {
    return []
  }
}

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export async function MarketOverview({ currency }: { currency: string }) {
  let global: any = null
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/api/global?vs_currency=${currency}`,
      { next: { revalidate: 60 } }
    )
    const json = await res.json()
    global = (json.data as any) ?? null
  } catch {}

  if (!global) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Market Overview</CardTitle></CardHeader>
        <CardContent><p className="text-xs text-muted-foreground">Loading market data...</p></CardContent>
      </Card>
    )
  }

  const fmt = (n: number | null | undefined) => {
    if (!n && n !== 0) return '—'
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
    return `$${n.toLocaleString()}`
  }

  const changePct = global.market_cap_change_percentage_24h_usd
  const changeStr = changePct != null ? `${changePct > 0 ? '+' : ''}${changePct.toFixed(1)}%` : '—'
  const changeColor = changePct != null ? (changePct >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]') : ''

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Market Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <Stat label="Active Cryptos" value={global.active_cryptocurrencies?.toLocaleString() ?? '—'} />
        <Stat label="Total Market Cap" value={fmt(global.total_market_cap_usd)} />
        <Stat label="24h Volume" value={fmt(global.total_volume_usd)} />
        <Stat label="BTC Dominance" value={`${global.btc_dominance?.toFixed(1) ?? '—'}%`} />
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  )
}

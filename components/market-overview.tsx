import { Separator } from '@/components/ui/separator'

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
      <div className="rounded-lg border border-border/40 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        Loading market data...
      </div>
    )
  }

  const fmt = (n: number | null | undefined) => {
    if (!n && n !== 0) return '—'
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
    return `$${n.toLocaleString()}`
  }

  const marketCap = global.total_market_cap?.[currency] ?? global.total_market_cap?.usd
  const volume = global.total_volume?.[currency] ?? global.total_volume?.usd
  const btcDominance = global.market_cap_percentage?.btc ?? global.btc_dominance

  return (
    <div className="rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-xs">
        <Stat label="Active Cryptos" value={global.active_cryptocurrencies?.toLocaleString() ?? '—'} />
        <Stat label="Total Market Cap" value={fmt(marketCap)} />
        <Stat label="24h Volume" value={fmt(volume)} />
        <Stat label="BTC Dominance" value={`${btcDominance?.toFixed(1) ?? '—'}%`} />
      </div>
    </div>
  )
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-muted-foreground">{label}</div>
    <div className="font-semibold mt-0.5 tabular-nums">{value}</div>
  </div>
)

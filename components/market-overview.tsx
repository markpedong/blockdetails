import { Card, CardContent } from '@/components/ui/card'
import { getGlobal } from '@/lib/crypto/service'
import { ErrorState } from '@/components/error-state'
import { formatCompact, formatPct } from '@/lib/utils'
import { PriceChangeInline } from '@/components/price-change'

export async function MarketOverview({ currency }: { currency: string }) {
  let global
  try { global = await getGlobal(currency) }
  catch { return <ErrorState compact message="Global market data is temporarily unavailable." /> }
  const marketCap = global.total_market_cap[currency]
  const volume = global.total_volume[currency]
  const btcDominance = global.market_cap_percentage.btc
  const ethDominance = global.market_cap_percentage.eth
  const marketCapChange = global.market_cap_change_percentage_24h_usd

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-3">
          <Stat label="Active Cryptos" value={global.active_cryptocurrencies?.toLocaleString() ?? '—'} />
          <Stat label={`Total Market Cap`} value={formatCompact(marketCap)} hint={marketCapChange != null ? <PriceChangeInline value={marketCapChange} /> : null} />
          <Stat label={`24h Volume`} value={formatCompact(volume)} />
          <Stat label="BTC Dominance" value={`${btcDominance?.toFixed(1) ?? '—'}%`} />
          <Stat label="ETH Dominance" value={`${ethDominance?.toFixed(1) ?? '—'}%`} />
          <Stat label="Market Cap 24h" value={marketCapChange != null ? formatPct(marketCapChange) : '—'} />
        </div>
      </CardContent>
    </Card>
  )
}

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: React.ReactNode }) => (
  <div>
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-sm font-semibold mt-0.5 tabular-nums text-foreground">{value}</div>
    {hint && <div className="mt-0.5">{hint}</div>}
  </div>
)

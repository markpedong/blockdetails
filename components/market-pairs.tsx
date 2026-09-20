import { getCoinMarkets, getExchangeMarkets } from '@/lib/crypto/service'
import { formatCompact, sanitizeUrl } from '@/lib/utils'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export async function MarketPairs({ id, exchange = false }: { id: string; exchange?: boolean }) {
  let pairs
  try { pairs = await (exchange ? getExchangeMarkets(id, 1) : getCoinMarkets(id, 1)) }
  catch { return <ErrorState compact message="Trading pairs are unavailable from the selected data provider." /> }
  return <section className="space-y-3"><h2 className="text-lg font-semibold">Trading Pairs</h2><p className="text-xs text-muted-foreground">First page of provider-reported markets. Volumes below are quoted in USD, independently of the selected display currency.</p>
    {pairs.length === 0 ? <EmptyState message="No trading pairs reported." /> : <div className="rounded-lg border overflow-hidden"><Table><TableHeader><TableRow><TableHead>Market</TableHead><TableHead>Pair</TableHead><TableHead className="text-right">24h Volume (USD)</TableHead><TableHead>Trust</TableHead></TableRow></TableHeader><TableBody>
      {pairs.map((pair, index) => <TableRow key={`${pair.market_id}-${pair.base}-${pair.quote}-${index}`}><TableCell>{pair.market_name}</TableCell><TableCell>{pair.trade_url && sanitizeUrl(pair.trade_url) !== '#' ? <a href={sanitizeUrl(pair.trade_url)} target="_blank" rel="noopener noreferrer" className="underline">{pair.base_symbol}/{pair.quote_symbol}</a> : `${pair.base_symbol}/${pair.quote_symbol}`}</TableCell><TableCell className="text-right tabular-nums">{formatCompact(pair.volume_24h_usd)}</TableCell><TableCell>{pair.trust_score ?? '—'}</TableCell></TableRow>)}
    </TableBody></Table></div>}
  </section>
}

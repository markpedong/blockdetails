import { Suspense } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { CryptoPagination } from '@/components/ui/crypto-pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

const ExchangesPage = () => {
  return (
    <div className="app-container py-6 space-y-4">
      <PageHeader
        title="Cryptocurrency Exchanges"
        description="Compare exchanges by volume, trust score, and supported markets."
      />
      <Suspense fallback={<Skeleton className="h-[500px] rounded-lg" />}>
        <ExchangesList />
      </Suspense>
    </div>
  )
}

export default ExchangesPage

const ExchangesList = async () => {
  let exchanges: any[] = []
  let totalCount = 0
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/api/exchanges?order=volume_desc&per_page=50`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(15_000) }
    )
    const json = await res.json()
    exchanges = json.data || []
    totalCount = (json as any)?.total_count || exchanges.length
  } catch {}

  if (exchanges.length === 0) {
    return <EmptyState message="No exchanges found." />
  }

  const totalPages = Math.ceil(totalCount / 50)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/40 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 bg-muted/20 hover:bg-transparent">
              <TableHead className="w-10 text-right text-xs font-medium text-muted-foreground">#</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Exchange</TableHead>
              <TableHead className="text-right hidden sm:table-cell text-xs font-medium text-muted-foreground">Trust Score</TableHead>
              <TableHead className="text-right text-xs font-medium text-muted-foreground">24h Volume</TableHead>
              <TableHead className="text-right hidden md:table-cell text-xs font-medium text-muted-foreground">Markets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exchanges.map(ex => (
              <TableRow key={ex.id} className="border-border/40 hover:bg-muted/10 transition-colors">
                <TableCell className="text-right text-muted-foreground font-mono text-xs">{ex.market_id}</TableCell>
                <TableCell>
                  <Link href={`/exchanges/${ex.id}`} className="font-medium text-sm hover:text-accent transition-colors">
                    {ex.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  {ex.score != null ? (
                    <Badge variant="outline" className={`tabular-nums text-xs ${
                      ex.score >= 7 ? 'text-[var(--positive)]' : ex.score >= 4 ? 'text-yellow-500' : 'text-[var(--negative)]'
                    }`}>
                      {ex.score}/10
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums text-sm">
                  {ex.quote_volume?.toLocaleString() ?? '—'}
                </TableCell>
                <TableCell className="text-right tabular-nums hidden md:table-cell text-sm">
                  {ex.num_coin_markets?.toLocaleString() ?? '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <CryptoPagination page={1} totalPages={totalPages} onPageChange={() => {}} />
      )}
    </div>
  )
}

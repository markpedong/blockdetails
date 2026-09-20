import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { Portfolio } from '@/components/portfolio'

export const metadata: Metadata = {
  title: 'Local Portfolio | BlockDetails',
  description: 'Track your cryptocurrency transactions and USD portfolio performance locally on your device.',
}

export default function PortfolioPage() {
  return <div className="app-container space-y-5 py-6">
    <PageHeader title="Portfolio" description="Track your holdings, cost basis and profit or loss. Local to this browser, with USD accounting." />
    <Portfolio />
  </div>
}

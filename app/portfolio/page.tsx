import type { Metadata } from 'next'
import { PortfolioProvider } from '@/components/portfolio-provider'
import { PortfolioDashboard } from '@/components/portfolio/portfolio-dashboard'

export const metadata: Metadata = {
  title: 'Portfolio | BlockDetails',
  description: 'Track your cryptocurrency portfolios, holdings, cost basis and profit or loss. Local to this browser.',
}

export default function PortfolioPage() {
  return (
    <div className="app-container py-6">
      <PortfolioProvider>
        <PortfolioDashboard />
      </PortfolioProvider>
    </div>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../lib/theme-provider'

export const metadata: Metadata = {
  title: 'BlockDetails — Cryptocurrency Market Dashboard',
  description: 'Real-time cryptocurrency prices, market cap, charts, and portfolio tracking.',
  openGraph: { title: 'BlockDetails', description: 'Real-time cryptocurrency market data.', type: 'website' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

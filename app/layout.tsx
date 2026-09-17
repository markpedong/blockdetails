import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../lib/theme-provider'
import Header from './components/header'
import Footer from './components/footer'

export const metadata: Metadata = {
  title: 'BlockDetails — Cryptocurrency Market Dashboard',
  description: 'Real-time cryptocurrency prices, market cap, charts, and portfolio tracking.',
  openGraph: { title: 'BlockDetails', description: 'Real-time cryptocurrency market data.', type: 'website' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1 app-container py-4 sm:py-6">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

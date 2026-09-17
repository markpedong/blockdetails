import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="app-container py-6 text-sm text-muted">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-accent text-base" aria-hidden>◆</span>
            <span className="font-medium text-foreground">BlockDetails</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/cryptocurrency" className="hover:text-accent transition">Cryptocurrencies</Link>
            <Link href="/cryptocurrency/tokens" className="hover:text-accent transition">Tokens</Link>
            <Link href="/exchanges" className="hover:text-accent transition">Exchanges</Link>
          </nav>

          <p>© {new Date().getFullYear()} BlockDetails. Market data from CoinGecko & CMC.</p>
        </div>
      </div>
    </footer>
  )
}

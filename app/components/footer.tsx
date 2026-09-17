import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg">◆</span>
            <span className="font-medium text-foreground">BlockDetails</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/cryptocurrency" className="hover:text-accent transition">Coins</Link>
            <Link href="/cryptocurrency/tokens" className="hover:text-accent transition">Tokens</Link>
            <Link href="/exchanges" className="hover:text-accent transition">Exchanges</Link>
          </nav>

          <p>© {new Date().getFullYear()} BlockDetails. Data from CoinGecko & CMC.</p>
        </div>
      </div>
    </footer>
  )
}

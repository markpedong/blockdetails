import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/20 mt-8">
      <div className="app-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-accent" aria-hidden>◆</span>
          <span className="font-medium text-foreground">BlockDetails</span>
          <span>·</span>
          <span>Real-time crypto market data</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Data by CoinGecko & CoinMarketCap</span>
          <span>·</span>
          <span>Not financial advice</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

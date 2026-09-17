import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="app-container py-6 text-center text-xs text-muted-foreground space-y-2">
        <p>Data provided by CoinGecko and CoinMarketCap.</p>
        <p>This is a demo application. Not financial advice.</p>
      </div>
    </footer>
  )
}

export default Footer

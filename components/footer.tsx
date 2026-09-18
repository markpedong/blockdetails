import { Logo } from './logo'

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/20 mt-8">
      <div className="app-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Logo className="w-4 h-4" />
          <span className="font-medium text-foreground">BlockDetails</span>
          <span>·</span>
          <span>Real-time crypto market data</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

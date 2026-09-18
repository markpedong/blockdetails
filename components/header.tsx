import Link from 'next/link'
import { SearchDialog } from './search-dialog'
import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './mobile-nav'
import { CurrencySelector } from './currency-selector'
import { Logo } from './logo'
const NAV = [
  { href: '/', label: 'Home' },
  { href: '/cryptocurrency', label: 'Cryptocurrencies' },
  { href: '/exchanges', label: 'Exchanges' },
]

const SiteHeader = () => {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="app-container h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-80 transition">
              <Logo className="w-6 h-6" />
              <span className="hidden sm:inline text-foreground">BlockDetails</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-0.5 text-sm" aria-label="Main navigation">
            {NAV.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className="px-2.5 py-1 rounded-md text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <SearchDialog />
            <CurrencySelector />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  )
}

export default SiteHeader



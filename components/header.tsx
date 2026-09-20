import Link from 'next/link'
import { SearchDialog } from './search-dialog'
import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './mobile-nav'
import { CurrencySelector } from './currency-selector'
import { Logo } from './logo'
import { Suspense } from 'react'
import { NavLinks } from './nav-links'

const SiteHeader = () => {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="app-container h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Suspense><MobileNav /></Suspense>
            <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-80 transition">
              <Logo className="w-6 h-6" />
              <span className="hidden sm:inline text-foreground">BlockDetails</span>
            </Link>
          </div>

          <Suspense><NavLinks /></Suspense>

          <div className="flex items-center gap-2">
            <Suspense><SearchDialog /></Suspense>
            <Suspense><CurrencySelector /></Suspense>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  )
}

export default SiteHeader



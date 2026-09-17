'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/cryptocurrency', label: 'Cryptocurrencies' },
  { href: '/exchanges', label: 'Exchanges' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-0.5 text-sm" aria-label="Main navigation">
      {NAV.map(n => {
        const isActive = pathname === n.href || (n.href !== '/' && pathname?.startsWith(n.href))
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {n.label}
          </Link>
        )
      })}
    </nav>
  )
}

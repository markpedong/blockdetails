'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { NAVIGATION } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export function NavLinks() {
  const pathname = usePathname()
  const currency = useSearchParams().get('currency')

  return (
    <nav className="hidden lg:flex items-center gap-1 text-sm" aria-label="Main navigation">
      {NAVIGATION.map(n => {
        const isActive = pathname === n.href || (n.href !== '/' && pathname?.startsWith(n.href))
        return (
          <Link
            key={n.href}
            href={currency ? `${n.href}?currency=${encodeURIComponent(currency)}` : n.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'text-foreground bg-foreground/15'
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/8',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            )}
          >
            {n.label}
          </Link>
        )
      })}
    </nav>
  )
}

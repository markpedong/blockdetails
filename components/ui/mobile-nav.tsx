'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/cryptocurrency', label: 'Cryptocurrencies' },
  { href: '/cryptocurrency/tokens', label: 'Tokens' },
  { href: '/exchanges', label: 'Exchanges' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8" aria-label="Open navigation menu">
          <MenuIcon className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:hidden">
        <SheetHeader>
          <SheetTitle className="text-left text-sm">Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-4" aria-label="Mobile navigation">
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                pathname === n.href || (n.href !== '/' && pathname?.startsWith(n.href))
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'hover:bg-muted/50'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { NAVIGATION } from '@/lib/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const currency = useSearchParams().get('currency')

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" className="xl:hidden h-8 w-8" aria-label="Open navigation menu" onClick={() => setOpen(true)}>
        <MenuIcon className="w-4 h-4" />
      </Button>
      <SheetContent side="left" className="w-[240px] xl:hidden">
        <SheetHeader>
          <SheetTitle className="text-left text-sm">Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-4" aria-label="Mobile navigation">
          {NAVIGATION.map(n => {
            const isActive = pathname === n.href || (n.href !== '/' && pathname?.startsWith(n.href))
            return (
              <Link
                key={n.href}
                href={currency ? `${n.href}?currency=${encodeURIComponent(currency)}` : n.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-colors font-medium',
                  isActive
                    ? 'text-foreground bg-foreground/15'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/8',
                )}
              >
                {n.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

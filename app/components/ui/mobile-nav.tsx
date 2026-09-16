'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/cryptocurrency', label: 'Coins' },
  { href: '/cryptocurrency/tokens', label: 'Tokens' },
  { href: '/exchanges', label: 'Exchanges' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on Escape or navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }
  }, [open])

  // Close when route changes (handled by Link onClick)
  const handleNav = () => setOpen(false)

  return (
    <>
      {/* Hamburger button — visible only on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden flex items-center gap-1.5 border border-border rounded-lg px-2 py-1 text-sm"
        aria-label="Open navigation menu"
      >
        <span>☰</span>
        <span className="text-muted">Menu</span>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[200] sm:hidden" onClick={handleNav}>
          <div className="fixed inset-0 bg-black/50" />
          <div
            className="fixed right-4 top-16 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="py-2">
              {NAV.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={handleNav}
                  className={`block px-4 py-2.5 text-sm transition ${pathname.startsWith(n.href) ? 'text-accent font-medium bg-accent/10' : 'hover:bg-muted/10'}`}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { href: '/cryptocurrency', label: 'Coins' },
  { href: '/cryptocurrency/tokens', label: 'Tokens' },
  { href: '/exchanges', label: 'Exchanges' }
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-4 text-sm">
      {NAV.map(n => (
        <Link
          key={n.href}
          href={n.href}
          className={`hover:text-accent transition ${pathname.startsWith(n.href) ? 'text-accent font-medium' : ''}`}
        >
          {n.label}
        </Link>
      ))}
    </nav>
  )
}

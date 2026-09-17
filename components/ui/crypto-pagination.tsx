'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface CryptoPaginationProps {
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export function CryptoPagination({ page, totalPages }: CryptoPaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const getPageNumbers = (current: number, total: number): number[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (current <= 3) return [1, 2, 3, 4, total]
    if (current >= total - 2) return [1, total - 3, total - 2, total - 1, total]
    return [1, current - 1, current, current + 1, total]
  }

  const pages = getPageNumbers(page, totalPages)

  const buildHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (p > 1) {
      params.set('page', String(p))
    } else {
      params.delete('page')
    }
    const query = params.toString()
    return `${pathname}${query ? `?${query}` : ''}`
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6 text-sm">
      <Link
        href={page > 1 ? buildHref(page - 1) : '#'}
        aria-disabled={page <= 1}
      >
        <Button variant="outline" size="sm" disabled={page <= 1}>
          ← Prev
        </Button>
      </Link>

      {pages.map(p => (
        <Link key={p} href={buildHref(p)}>
          <Button variant={p === page ? 'default' : 'outline'} size="sm" className="w-8 h-8 p-0">
            {p}
          </Button>
        </Link>
      ))}

      <Link
        href={page < totalPages ? buildHref(page + 1) : '#'}
        aria-disabled={page >= totalPages}
      >
        <Button variant="outline" size="sm" disabled={page >= totalPages}>
          Next →
        </Button>
      </Link>
    </div>
  )
}

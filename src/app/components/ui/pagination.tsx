import Link from 'next/link'

export function Pagination({
  currentPage,
  totalPages,
  baseHref,
}: {
  currentPage: number
  totalPages: number
  baseHref: string
}) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6 text-sm">
      <Link
        href={`${baseHref}${currentPage > 1 ? `?page=${currentPage - 1}` : ''}`}
        className={`px-3 py-1.5 rounded-lg border transition ${currentPage > 1 ? 'border-border hover:bg-muted/10' : 'border-border opacity-40 cursor-not-allowed'}`}
        aria-disabled={currentPage <= 1}
      >
        ← Prev
      </Link>

      {pages.map(p => (
        <Link
          key={p}
          href={`${baseHref}${p > 1 ? `?page=${p}` : ''}`}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border transition ${p === currentPage ? 'bg-accent text-white border-accent' : 'border-border hover:bg-muted/10'}`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={`${baseHref}${currentPage < totalPages ? `?page=${currentPage + 1}` : ''}`}
        className={`px-3 py-1.5 rounded-lg border transition ${currentPage < totalPages ? 'border-border hover:bg-muted/10' : 'border-border opacity-40 cursor-not-allowed'}`}
        aria-disabled={currentPage >= totalPages}
      >
        Next →
      </Link>
    </div>
  )
}

function getPageNumbers(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, total]
  if (current >= total - 2) return [1, total - 3, total - 2, total - 1, total]
  return [1, current - 1, current, current + 1, total]
}

import Link from 'next/link'

const SORT_MAP: Record<string, string> = {
  market_cap_desc: 'market_cap',
  price_change_24h_desc: '24h_change',
  price_change_percentage_24h_desc: '24h_change_pct',
  price_change_percentage_7d_desc: '7d_change',
  volume_desc: 'volume',
  price_desc: 'price',
}

export function SortHeader({
  label,
  sortKey,
  currentSort,
  baseHref,
}: {
  label: string
  sortKey: string
  currentSort?: string
  baseHref: string
}) {
  const isActive = currentSort === sortKey || (currentSort && SORT_MAP[currentSort] === sortKey)
  const isDesc = currentSort?.endsWith('_desc') ?? false

  // Build sort param: toggle between desc/asc or clear
  const newSort = isActive ? '' : `${sortKey}_desc`
  const href = newSort ? `${baseHref}${baseHref.includes('?') ? '&' : '?'}order=${newSort}` : baseHref

  return (
    <Link
      href={href}
      className={`flex items-center gap-1 cursor-pointer select-none ${isActive ? 'text-accent' : ''}`}
    >
      {label}
      <span className="text-xs opacity-60">
        {isActive ? (isDesc ? ' ↓' : ' ↑') : ''}
      </span>
    </Link>
  )
}

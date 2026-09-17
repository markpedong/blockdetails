import Image from 'next/image'
import Link from 'next/link'

interface CoinIdentityProps {
  name: string
  symbol?: string
  image?: string | null
  rank?: number | null
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export function CoinIdentity({ name, symbol, image, rank, size = 'md', href }: CoinIdentityProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const textClasses = {
    sm: { name: 'text-sm', symbol: 'text-xs' },
    md: { name: 'text-sm', symbol: 'text-xs' },
    lg: { name: 'text-base', symbol: 'text-sm' },
  }

  const t = textClasses[size]

  const content = (
    <div className="flex items-center gap-2">
      {image && (
        <Image
          src={image}
          alt=""
          width={size === 'lg' ? 32 : 24}
          height={size === 'lg' ? 32 : 24}
          className={`${sizeClasses[size]} rounded-full`}
          unoptimized
        />
      )}
      <div>
        <span className={t.name}>{name}</span>
        {symbol && (
          <span className={`block ${t.symbol} text-muted-foreground`}>{symbol.toUpperCase()}</span>
        )}
      </div>
      {rank != null && (
        <span className="text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-full">
          #{rank}
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

import Image from 'next/image'

interface CoinIdentityProps {
  name: string
  symbol?: string
  image?: string | null
  rank?: number | null
  size?: 'sm' | 'md' | 'lg'
}

export function CoinIdentity({ name, symbol, image, rank, size = 'md' }: CoinIdentityProps) {
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
  const imgSize = size === 'lg' ? 32 : 24

  return (
    <div className="flex items-center gap-2">
      {image ? (
        <Image
          src={image}
          alt=""
          width={imgSize}
          height={imgSize}
          className={`${sizeClasses[size]} rounded-full`}
          unoptimized
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-muted/50 flex items-center justify-center text-[10px] font-medium text-muted-foreground`}>
          {symbol?.slice(0, 3) ?? name.slice(0, 3)}
        </div>
      )}
      <div className="min-w-0">
        <span className={`${t.name} truncate block`}>{name}</span>
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
}

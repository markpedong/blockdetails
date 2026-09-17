import { Separator } from '@/components/ui/separator'

interface MarketStatProps {
  label: string
  value: string
  change?: string
  changeColor?: string
}

export function MarketStat({ label, value, change, changeColor }: MarketStatProps) {
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-sm tabular-nums">{value}</dd>
      {change && (
        <dd className={`text-xs tabular-nums ${changeColor || 'text-muted-foreground'}`}>
          {change}
        </dd>
      )}
    </div>
  )
}

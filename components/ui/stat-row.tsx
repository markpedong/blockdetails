import { cn } from '@/lib/cn'

interface StatRowProps {
  label: string
  value: string
}

const StatRow = ({ label, value }: StatRowProps) => {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

export { StatRow }

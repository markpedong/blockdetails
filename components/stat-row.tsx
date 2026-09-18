interface StatRowProps {
  label: string
  value: string
}

const StatRow = ({ label, value }: StatRowProps) => {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </div>
  )
}

export { StatRow }

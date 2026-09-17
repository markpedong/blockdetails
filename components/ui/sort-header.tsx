import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type SortKey = 'market_cap_desc' | 'market_cap_asc' | 'volume_desc' | 'volume_asc' | 'name_asc' | 'name_desc'

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Market Cap (High → Low)', value: 'market_cap_desc' },
  { label: 'Market Cap (Low → High)', value: 'market_cap_asc' },
  { label: 'Volume (High → Low)', value: 'volume_desc' },
  { label: 'Volume (Low → High)', value: 'volume_asc' },
  { label: 'Name (A → Z)', value: 'name_asc' },
  { label: 'Name (Z → A)', value: 'name_desc' },
]

export function SortHeader({ current, onSort }: { current: SortKey; onSort: (k: SortKey) => void }) {
  return (
    <Select value={current} onValueChange={(v) => onSort(v as SortKey)}>
      <SelectTrigger className="w-[200px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

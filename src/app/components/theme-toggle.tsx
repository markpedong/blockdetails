'use client'

import { useTheme } from '@/lib/theme'

export function ThemeToggle({ theme, setTheme }: { theme: string; setTheme: (t: 'system' | 'light' | 'dark') => void }) {
  const modes: ('system' | 'light' | 'dark')[] = ['system', 'light', 'dark']
  const idx = modes.indexOf(theme as (typeof modes)[number])

  return (
    <div className="flex rounded-lg border border-border overflow-hidden text-xs">
      {modes.map((m, i) => (
        <button
          key={m}
          onClick={() => setTheme(m)}
          className={`px-2 py-1 transition ${i === idx ? 'bg-accent text-white' : 'hover:bg-muted/20'}`}
        >
          {m === 'system' ? '☀️/🌙' : m === 'light' ? '☀️' : '🌙'}
        </button>
      ))}
    </div>
  )
}

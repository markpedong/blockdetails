'use client'

import { useTheme } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoonIcon, SunIcon, MonitorIcon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const modes: ('system' | 'light' | 'dark')[] = ['system', 'light', 'dark']

  const iconMap: Record<string, React.ReactNode> = {
    system: <MonitorIcon className="w-4 h-4" />,
    light: <SunIcon className="w-4 h-4" />,
    dark: <MoonIcon className="w-4 h-4" />,
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Toggle theme" {...props}>
            {theme === 'system' ? <MonitorIcon className="w-4 h-4" /> : theme === 'light' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      />
      <DropdownMenuContent align="end">
        {modes.map(m => (
          <DropdownMenuItem key={m} onClick={() => setTheme(m)} className={theme === m ? 'bg-accent/10 text-accent' : ''}>
            {iconMap[m]}
            <span className="ml-2 capitalize">{m}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

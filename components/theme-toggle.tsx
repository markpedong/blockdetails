'use client'

import { useTheme } from '@/components/theme'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoonIcon, SunIcon, MonitorIcon } from 'lucide-react'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()
	const modes: ('system' | 'light' | 'dark')[] = ['system', 'light', 'dark']

	const iconMap: Record<string, React.ReactNode> = {
		system: <MonitorIcon className="w-4 h-4" />,
		light: <SunIcon className="w-4 h-4" />,
		dark: <MoonIcon className="w-4 h-4" />
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="inline-flex size-7 items-center justify-center rounded-md text-xs/relaxed font-medium transition-all hover:bg-muted hover:text-foreground dark:hover:bg-muted/50"
				aria-label="Toggle theme"
			>
				{theme === 'system' ? (
					<MonitorIcon className="w-4 h-4" />
				) : theme === 'light' ? (
					<SunIcon className="w-4 h-4" />
				) : (
					<MoonIcon className="w-4 h-4" />
				)}
				<span className="sr-only">Toggle theme</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{modes.map(m => (
					<DropdownMenuItem
						key={m}
						onClick={() => setTheme(m)}
						className={theme === m ? 'bg-accent/10 text-accent' : ''}
					>
						{iconMap[m]}
						<span className="ml-2 capitalize">{m}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

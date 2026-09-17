'use client'

import * as React from 'react'
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import { cn } from '@/lib/cn'

interface ToggleGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => (
    <BaseToggleGroup
      ref={ref}
      value={value ? [value] : []}
      onValueChange={(v: string[]) => onValueChange?.(v[0] ?? '')}
      className={cn('inline-flex items-center gap-0.5 rounded-md border border-border/40 bg-muted/20 p-0.5', className)}
      {...props}
    >
      {children}
    </BaseToggleGroup>
  )
)
ToggleGroup.displayName = 'ToggleGroup'

interface ToggleGroupItemProps {
  value: string
  className?: string
  children?: React.ReactNode
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors',
        'text-muted-foreground hover:text-foreground hover:bg-muted/50',
        'data-[on=true]:bg-accent data-[on=true]:text-accent-foreground',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }

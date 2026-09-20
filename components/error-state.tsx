import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  compact?: boolean
}

export function ErrorState({ message = 'Unable to load data. Please try again.', onRetry, compact }: ErrorStateProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="h-auto px-2">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="text-center py-12 space-y-3">
      <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground/50" />
      <p className="text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

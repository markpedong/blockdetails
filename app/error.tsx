 'use client'
import { ErrorState } from '@/components/error-state'
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="app-container py-6"><ErrorState message="This page could not be loaded. Please try again." onRetry={reset} /></div>
}

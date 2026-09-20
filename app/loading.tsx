import { Skeleton } from '@/components/ui/skeleton'
export default function Loading() { return <div className="app-container py-6 space-y-4" role="status" aria-label="Loading market data"><Skeleton className="h-10 w-64" /><Skeleton className="h-[400px] rounded-lg" /><span className="sr-only">Loading market data…</span></div> }

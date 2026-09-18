import Link from 'next/link'

export const dynamic = 'force-dynamic'

const NotFound = () => {
  return (
    <div className="text-center py-24 space-y-4">
      <h1 className="text-5xl font-bold text-muted/30">404</h1>
      <h2 className="text-xl font-semibold text-foreground">Page not found</h2>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="inline-flex items-center justify-center text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
        ← Back to Home
      </Link>
    </div>
  )
}

export default NotFound

import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="text-center py-24 space-y-4">
      <h1 className="text-5xl font-bold text-muted/30">404</h1>
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="inline-block text-sm bg-accent text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
        ← Back to Home
      </Link>
    </div>
  )
}

export default NotFound

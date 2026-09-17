import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-24 space-y-4">
      <h1 className="text-6xl font-bold text-muted/30">404</h1>
      <h2 className="text-xl font-semibold">Page Not Found</h2>
      <p className="text-muted">This page doesn't exist.</p>
      <Link href="/" className="inline-block px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition text-sm font-medium">
        ← Back to Home
      </Link>
    </div>
  )
}

export function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="var(--primary)" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="var(--primary)" opacity="0.7" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="var(--primary)" opacity="0.4" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="var(--primary)" opacity="0.85" />
    </svg>
  )
}

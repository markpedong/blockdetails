interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-xl">
          {description}
        </p>
      )}
    </div>
  )
}

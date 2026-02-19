import { Link } from 'react-router-dom'

const ICONS: Record<string, React.ReactNode> = {
  trim: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  ),
  merge: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3v18" />
      <path d="M16 3v18" />
      <path d="M3 8h6" />
      <path d="M15 8h6" />
      <path d="M3 16h6" />
      <path d="M15 16h6" />
    </svg>
  ),
  convert: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  ),
  compress: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
      <path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
      <path d="M4 12h16" />
    </svg>
  ),
  speed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="m4.93 4.93 2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="m4.93 19.07 2.83-2.83" />
      <path d="m16.24 7.76 2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  extract: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
}

export type ToolCategory =
  | 'organize'
  | 'convert'
  | 'optimize'
  | 'extract'

interface ToolCardProps {
  title: string
  description: string
  to: string
  icon?: string
  category?: ToolCategory
  comingSoon?: boolean
}

export function ToolCard({ title, description, to, icon, comingSoon }: ToolCardProps) {
  const iconEl = icon && ICONS[icon] ? ICONS[icon] : null

  const cardContent = (
    <>
      {iconEl && (
        <span
          className={`mb-4 block w-8 h-8 ${comingSoon ? 'text-[var(--color-text-muted)] opacity-60' : 'text-[var(--color-primary)]'}`}
          aria-hidden
        >
          {iconEl}
        </span>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-text)]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        {description}
      </p>
      {comingSoon && (
        <span className="mt-3 inline-block text-xs font-medium text-[var(--color-primary)]">
          Coming soon
        </span>
      )}
    </>
  )

  if (comingSoon) {
    return (
      <div
        className="block p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] opacity-90 cursor-not-allowed"
        aria-disabled
      >
        {cardContent}
      </div>
    )
  }

  return (
    <Link
      to={to}
      className="block p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-200 shadow-sm"
    >
      {cardContent}
    </Link>
  )
}

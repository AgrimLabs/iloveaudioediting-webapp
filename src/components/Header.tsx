import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
        >
          iLoveAudioEditing
        </Link>
      </div>
    </header>
  )
}

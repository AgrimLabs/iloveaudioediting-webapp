interface ProgressBarProps {
  progress: number // 0-100
  label?: string
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      {label && (
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
      )}
      <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}

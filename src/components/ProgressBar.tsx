interface ProgressBarProps {
  progress: number // 0-100
  label?: string
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      {label && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      )}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}

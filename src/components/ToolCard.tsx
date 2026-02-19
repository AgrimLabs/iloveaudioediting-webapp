import { Link } from 'react-router-dom'

interface ToolCardProps {
  title: string
  description: string
  to: string
  icon?: string
}

export function ToolCard({ title, description, to, icon }: ToolCardProps) {
  return (
    <Link
      to={to}
      className="block p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm hover:shadow-md"
    >
      {icon && (
        <span className="text-3xl mb-3 block" role="img" aria-hidden>
          {icon}
        </span>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </Link>
  )
}

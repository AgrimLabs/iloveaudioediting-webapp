import { ToolCard } from '../components/ToolCard'

const TOOLS = [
  {
    id: 'trim',
    title: 'Trim Audio',
    description: 'Cut and trim your audio files to the exact length you need.',
    to: '/trim',
    icon: '✂️',
  },
  {
    id: 'merge',
    title: 'Merge Audio',
    description: 'Combine multiple audio files into one.',
    to: '/merge',
    icon: '🔗',
  },
  {
    id: 'convert',
    title: 'Convert Audio',
    description: 'Convert between MP3, M4A, WAV and other formats.',
    to: '/convert',
    icon: '🔄',
  },
]

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            iLoveAudio
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Simple, offline audio tools. No login required.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              to={tool.to}
              icon={tool.icon}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Footer } from '../components/Footer'
import { ToolCard, type ToolCategory } from '../components/ToolCard'

const TOOLS = [
  {
    id: 'trim',
    title: 'Trim Audio',
    description: 'Cut and trim your audio files to the exact length you need.',
    to: '/trim',
    icon: 'trim',
    category: 'organize' as ToolCategory,
  },
  {
    id: 'merge',
    title: 'Merge Audio',
    description: 'Combine multiple audio files into one.',
    to: '/merge',
    icon: 'merge',
    category: 'organize' as ToolCategory,
  },
  {
    id: 'convert',
    title: 'Convert Audio',
    description: 'Convert between MP3, M4A, WAV and other formats.',
    to: '/convert',
    icon: 'convert',
    category: 'convert' as ToolCategory,
  },
  {
    id: 'compress',
    title: 'Compress Audio',
    description: 'Reduce file size while optimizing for maximal audio quality.',
    to: '#',
    icon: 'compress',
    category: 'optimize' as ToolCategory,
    comingSoon: true,
  },
  {
    id: 'speed',
    title: 'Change Speed',
    description: 'Adjust playback speed of your audio files.',
    to: '#',
    icon: 'speed',
    category: 'optimize' as ToolCategory,
    comingSoon: true,
  },
  {
    id: 'extract',
    title: 'Extract from Video',
    description: 'Extract audio track from video files.',
    to: '#',
    icon: 'extract',
    category: 'extract' as ToolCategory,
    comingSoon: true,
  },
]

export function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <ToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                to={tool.to}
                icon={tool.icon}
                category={tool.category}
                comingSoon={tool.comingSoon}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

import { useState } from 'react'
import { ToolShell } from '../components/ToolShell'
import { trimAudio } from '../services/ffmpeg'

function getOutputFilename(inputName: string): string {
  const ext = inputName.split('.').pop() || 'mp3'
  const base = inputName.replace(/\.[^.]+$/, '')
  return `${base}_trimmed.${ext}`
}

export function TrimTool() {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(60)
  const [duration, setDuration] = useState<number | null>(null)

  const handleFilesChange = (files: File[]) => {
    const file = files[0]
    if (!file) {
      setDuration(null)
      return
    }
    const audio = new Audio()
    const url = URL.createObjectURL(file)
    audio.src = url
    audio.onloadedmetadata = () => {
      const d = audio.duration
      setDuration(d)
      setEnd(d)
      URL.revokeObjectURL(url)
    }
    audio.onerror = () => URL.revokeObjectURL(url)
  }

  async function processTrim(files: File[]) {
    const file = files[0]
    if (!file) throw new Error('No file selected')
    if (start >= end) throw new Error('Start must be less than end')

    const blob = await trimAudio(file, start, end)
    return {
      blob,
      filename: getOutputFilename(file.name),
    }
  }

  return (
    <ToolShell
      title="Trim Audio"
      accept="audio/*"
      multiple={false}
      processFn={processTrim}
      onFilesChange={handleFilesChange}
      options={() => (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            Set start and end time in seconds.{' '}
            {duration != null && `(Duration: ${Math.round(duration)}s)`}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">Start (s)</label>
              <input
                type="number"
                min={0}
                max={duration ?? 9999}
                step={0.1}
                value={start}
                onChange={(e) => setStart(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">End (s)</label>
              <input
                type="number"
                min={0}
                max={duration ?? 9999}
                step={0.1}
                value={end}
                onChange={(e) => setEnd(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    />
  )
}

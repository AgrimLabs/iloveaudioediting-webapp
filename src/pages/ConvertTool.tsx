import { useState } from 'react'
import { ToolShell } from '../components/ToolShell'
import { convertAudio, type OutputFormat } from '../services/ffmpeg'

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: 'mp3', label: 'MP3' },
  { value: 'm4a', label: 'M4A' },
  { value: 'wav', label: 'WAV' },
]

function getOutputFilename(inputName: string, format: OutputFormat): string {
  const base = inputName.replace(/\.[^.]+$/, '')
  return `${base}.${format}`
}

export function ConvertTool() {
  const [format, setFormat] = useState<OutputFormat>('mp3')

  async function processConvert(files: File[]) {
    const file = files[0]
    if (!file) throw new Error('No file selected')

    const blob = await convertAudio(file, format)
    return {
      blob,
      filename: getOutputFilename(file.name, format),
    }
  }

  return (
    <ToolShell
      title="Convert Audio"
      accept="audio/*"
      multiple={false}
      processFn={processConvert}
      options={
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            Choose output format:
          </p>
          <div className="flex flex-wrap gap-4">
            {FORMATS.map((f) => (
              <label
                key={f.value}
                className="flex items-center gap-2 cursor-pointer text-[var(--color-text)]"
              >
                <input
                  type="radio"
                  name="format"
                  value={f.value}
                  checked={format === f.value}
                  onChange={() => setFormat(f.value)}
                  className="w-4 h-4 accent-[var(--color-primary)]"
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
        </div>
      }
    />
  )
}

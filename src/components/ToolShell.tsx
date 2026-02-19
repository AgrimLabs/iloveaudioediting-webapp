import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from './Header'
import { FileDropzone } from './FileDropzone'
import { ProgressBar } from './ProgressBar'
import { DownloadButton } from './DownloadButton'

export interface ProcessResult {
  blob: Blob
  filename: string
}

export interface ToolShellProps {
  title: string
  accept?: string
  multiple?: boolean
  processFn: (files: File[]) => Promise<ProcessResult>
  options?: React.ReactNode | ((files: File[]) => React.ReactNode)
  onFilesChange?: (files: File[]) => void
  /** Custom file input (e.g. separate slots for merge). Replaces default FileDropzone. */
  customFileInput?: (props: {
    onFilesSelected: (files: File[]) => void
    selectedFiles: File[]
  }) => React.ReactNode
  /** Minimum files required (default 1). Disables Process button until met. */
  minFiles?: number
}

const RELATED_TOOLS = [
  { label: 'Trim Audio', to: '/trim' },
  { label: 'Merge Audio', to: '/merge' },
  { label: 'Convert Audio', to: '/convert' },
]

export function ToolShell({
  title,
  accept = 'audio/*',
  multiple = false,
  processFn,
  options,
  onFilesChange,
  customFileInput,
  minFiles = 1,
}: ToolShellProps) {
  const [files, setFiles] = useState<File[]>([])

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(newFiles)
    onFilesChange?.(newFiles)
  }
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>(
    'idle'
  )
  const [progress, setProgress] = useState(0)
  const [processingSeconds, setProcessingSeconds] = useState(0)
  const [result, setResult] = useState<ProcessResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleProcess = async () => {
    if (!files.length) return
    setStatus('processing')
    setProgress(0)
    setProcessingSeconds(0)
    setError(null)
    setResult(null)

    let progressInterval: ReturnType<typeof setInterval> | null = null
    let secondsInterval: ReturnType<typeof setInterval> | null = null
    try {
      // Simulate progress for UX (real progress comes from FFmpeg later)
      progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90))
      }, 200)
      secondsInterval = setInterval(() => {
        setProcessingSeconds((s) => s + 1)
      }, 1000)

      const res = await processFn(files)
      if (progressInterval) clearInterval(progressInterval)
      if (secondsInterval) clearInterval(secondsInterval)
      setProgress(100)
      setResult(res)
      setStatus('done')
    } catch (err) {
      if (progressInterval) clearInterval(progressInterval)
      if (secondsInterval) clearInterval(secondsInterval)
      const message = err instanceof Error ? err.message : String(err)
      if (import.meta.env.DEV) console.error('[iLoveAudio] Processing error:', err)
      setError(message)
      setStatus('error')
    }
  }

  const handleReset = () => {
    setFiles([])
    setStatus('idle')
    setProgress(0)
    setProcessingSeconds(0)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">{title}</h1>

        {customFileInput ? (
          customFileInput({
            onFilesSelected: handleFilesSelected,
            selectedFiles: files,
          })
        ) : (
          <FileDropzone
            accept={accept}
            multiple={multiple}
            onFilesSelected={handleFilesSelected}
            selectedFiles={files}
          />
        )}

        {options && (
          <div>
            {typeof options === 'function' ? options(files) : options}
          </div>
        )}

        {status === 'idle' && (
          <button
            onClick={handleProcess}
            disabled={files.length < minFiles}
            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Process
          </button>
        )}

        {status === 'processing' && (
          <div className="space-y-2">
            <ProgressBar
              progress={progress}
              label={
                processingSeconds > 5
                  ? `Processing... (${processingSeconds}s — first run loads FFmpeg ~25MB)`
                  : 'Processing...'
              }
            />
          </div>
        )}

        {status === 'done' && result && (
          <div className="space-y-4">
            <p className="text-green-600 font-medium">Done!</p>
            <div className="flex flex-wrap gap-3">
              <DownloadButton
                blob={result.blob}
                filename={result.filename}
              />
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-card)] text-[var(--color-text)] transition-colors"
              >
                Process another
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-card)] text-[var(--color-text)] transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        <div className="pt-8 mt-8 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            Related tools
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {RELATED_TOOLS.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

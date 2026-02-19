import { useState } from 'react'
import { Link } from 'react-router-dom'
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
      console.error('[iLoveAudio] Processing error:', err)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
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
            <p className="text-green-600 dark:text-green-400 font-medium">
              Done!
            </p>
            <DownloadButton
              blob={result.blob}
              filename={result.filename}
            />
            <button
              onClick={handleReset}
              className="ml-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Process another
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

import { useCallback, useState } from 'react'
import { filterAudioFiles } from '../utils/audio'

interface FileDropzoneProps {
  accept?: string
  multiple?: boolean
  onFilesSelected: (files: File[]) => void
  selectedFiles: File[]
}

export function FileDropzone({
  accept = 'audio/*',
  multiple = false,
  onFilesSelected,
  selectedFiles,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = filterAudioFiles(Array.from(e.dataTransfer.files))
      if (files.length) onFilesSelected(multiple ? files : [files[0]])
    },
    [multiple, onFilesSelected]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? filterAudioFiles(Array.from(e.target.files)) : []
      if (files.length) onFilesSelected(multiple ? files : [files[0]])
    },
    [multiple, onFilesSelected]
  )

  return (
    <div className="space-y-2">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-[var(--color-primary)] bg-[#fef2f2]'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 bg-[var(--color-bg-card)]'
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
        <p className="text-[var(--color-text-muted)]">
          {selectedFiles.length
            ? `${selectedFiles.length} file(s) selected`
            : 'Drop files here or click to browse'}
        </p>
      </label>
      {selectedFiles.length > 0 && (
        <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
          {selectedFiles.map((f, i) => (
            <li key={i}>{f.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

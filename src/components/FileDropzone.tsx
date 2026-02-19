import { useCallback, useState } from 'react'

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
      const files = Array.from(e.dataTransfer.files)
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
      const files = e.target.files ? Array.from(e.target.files) : []
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
        className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
        <p className="text-gray-600 dark:text-gray-400">
          {selectedFiles.length
            ? `${selectedFiles.length} file(s) selected`
            : 'Drop files here or click to browse'}
        </p>
      </label>
      {selectedFiles.length > 0 && (
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {selectedFiles.map((f, i) => (
            <li key={i}>{f.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'

interface MergeFileSelectorProps {
  accept?: string
  onFilesSelected: (files: File[]) => void
  selectedFiles: File[]
}

export function MergeFileSelector({
  accept = 'audio/*',
  onFilesSelected,
  selectedFiles,
}: MergeFileSelectorProps) {
  const [slots, setSlots] = useState<(File | null)[]>([])

  const syncToParent = useCallback(
    (newSlots: (File | null)[]) => {
      const files = newSlots.filter((f): f is File => f !== null)
      onFilesSelected(files)
    },
    [onFilesSelected]
  )

  // Reset when parent clears (e.g. "Process another")
  useEffect(() => {
    if (selectedFiles.length === 0) {
      setSlots([null, null])
    }
  }, [selectedFiles.length])

  const setSlot = useCallback(
    (index: number, file: File | null) => {
      setSlots((prev) => {
        const next = [...prev]
        next[index] = file
        const filtered = next.filter((f): f is File => f !== null)
        syncToParent(filtered)
        return next
      })
    },
    [syncToParent]
  )

  const addSlot = useCallback(() => {
    setSlots((prev) => {
      const next = [...prev, null]
      syncToParent(next.filter((f): f is File => f !== null))
      return next
    })
  }, [syncToParent])

  const removeSlot = useCallback(
    (index: number) => {
      setSlots((prev) => {
        const next = prev.filter((_, i) => i !== index)
        syncToParent(next.filter((f): f is File => f !== null))
        return next
      })
    },
    [syncToParent]
  )

  const handleFileForSlot = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) setSlot(index, file)
      e.target.value = ''
    },
    [setSlot]
  )

  const handleDropForSlot = useCallback(
    (index: number, e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) setSlot(index, file)
    },
    [setSlot]
  )

  const displaySlots = slots.length >= 2 ? slots : [null, null]

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Add files in the order you want them merged. Each file has its own slot.
      </p>
      <div className="space-y-3">
        {displaySlots.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-16 shrink-0">
              File {index + 1}
            </span>
            <label
              onDrop={(e) => handleDropForSlot(index, e)}
              onDragOver={(e) => e.preventDefault()}
              className="flex-1 min-w-0 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <input
                type="file"
                accept={accept}
                onChange={(e) => handleFileForSlot(index, e)}
                className="hidden"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate block">
                {file ? file.name : 'Drop or click to select'}
              </span>
            </label>
            <button
              type="button"
              onClick={() => removeSlot(index)}
              disabled={displaySlots.length <= 2}
              className="shrink-0 px-2 py-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Remove"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addSlot}
        className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        + Add another file
      </button>
    </div>
  )
}

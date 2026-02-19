import { useCallback, useEffect, useState } from 'react'
import { isAudioFile } from '../utils/audio'

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

  // Reset when parent clears (e.g. "Process another") — defer to avoid sync setState in effect
  useEffect(() => {
    if (selectedFiles.length === 0) {
      queueMicrotask(() => setSlots([null, null]))
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
      if (file && isAudioFile(file)) setSlot(index, file)
      e.target.value = ''
    },
    [setSlot]
  )

  const handleDropForSlot = useCallback(
    (index: number, e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && isAudioFile(file)) setSlot(index, file)
    },
    [setSlot]
  )

  const displaySlots = slots.length >= 2 ? slots : [null, null]

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        Add files in the order you want them merged. Each file has its own slot.
      </p>
      <div className="space-y-3">
        {displaySlots.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-card)]"
          >
            <span className="text-sm font-medium text-[var(--color-text-muted)] w-16 shrink-0">
              File {index + 1}
            </span>
            <label
              onDrop={(e) => handleDropForSlot(index, e)}
              onDragOver={(e) => e.preventDefault()}
              className="flex-1 min-w-0 border-2 border-dashed border-[var(--color-border)] rounded-lg px-4 py-3 cursor-pointer hover:border-[var(--color-primary)]/50 transition-colors"
            >
              <input
                type="file"
                accept={accept}
                onChange={(e) => handleFileForSlot(index, e)}
                className="hidden"
              />
              <span className="text-sm text-[var(--color-text-muted)] truncate block">
                {file ? file.name : 'Drop or click to select'}
              </span>
            </label>
            <button
              type="button"
              onClick={() => removeSlot(index)}
              disabled={displaySlots.length <= 2}
              className="shrink-0 px-2 py-1 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
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
        className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-card)] text-[var(--color-text)] transition-colors"
      >
        + Add another file
      </button>
    </div>
  )
}

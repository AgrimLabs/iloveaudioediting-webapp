interface DownloadButtonProps {
  blob: Blob
  filename: string
  disabled?: boolean
}

export function DownloadButton({
  blob,
  filename,
  disabled = false,
}: DownloadButtonProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
    >
      Download {filename}
    </button>
  )
}

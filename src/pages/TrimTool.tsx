import { ToolShell } from '../components/ToolShell'

// Mock processFn - will be replaced with FFmpeg in next commit
async function processTrim(_files: File[]) {
  await new Promise((r) => setTimeout(r, 1000))
  return {
    blob: new Blob(['trimmed audio placeholder'], { type: 'audio/mpeg' }),
    filename: 'trimmed.mp3',
  }
}

export function TrimTool() {
  return (
    <ToolShell
      title="Trim Audio"
      accept="audio/*"
      multiple={false}
      processFn={processTrim}
      options={
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Start/end controls coming with FFmpeg integration.
        </p>
      }
    />
  )
}

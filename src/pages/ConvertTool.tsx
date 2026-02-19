import { ToolShell } from '../components/ToolShell'

// Mock processFn - will be replaced with FFmpeg in next commit
async function processConvert(_files: File[]) {
  await new Promise((r) => setTimeout(r, 1000))
  return {
    blob: new Blob(['converted audio placeholder'], { type: 'audio/mpeg' }),
    filename: 'converted.mp3',
  }
}

export function ConvertTool() {
  return (
    <ToolShell
      title="Convert Audio"
      accept="audio/*"
      multiple={false}
      processFn={processConvert}
      options={
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Format selector coming with FFmpeg integration.
        </p>
      }
    />
  )
}

import { ToolShell } from '../components/ToolShell'

// Mock processFn - will be replaced with FFmpeg in next commit
async function processMerge(_files: File[]) {
  await new Promise((r) => setTimeout(r, 1000))
  return {
    blob: new Blob(['merged audio placeholder'], { type: 'audio/mpeg' }),
    filename: 'merged.mp3',
  }
}

export function MergeTool() {
  return (
    <ToolShell
      title="Merge Audio"
      accept="audio/*"
      multiple={true}
      processFn={processMerge}
    />
  )
}

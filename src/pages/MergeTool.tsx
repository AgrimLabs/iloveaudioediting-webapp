import { ToolShell } from '../components/ToolShell'
import { mergeAudio } from '../services/ffmpeg'

export function MergeTool() {
  async function processMerge(files: File[]) {
    if (files.length < 2) throw new Error('Select at least 2 files to merge')

    const blob = await mergeAudio(files)
    return {
      blob,
      filename: 'merged.mp3',
    }
  }

  return (
    <ToolShell
      title="Merge Audio"
      accept="audio/*"
      multiple={true}
      processFn={processMerge}
      options={
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Files will be merged in the order they are selected.
        </p>
      }
    />
  )
}

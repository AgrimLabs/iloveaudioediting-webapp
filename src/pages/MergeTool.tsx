import { ToolShell } from '../components/ToolShell'
import { MergeFileSelector } from '../components/MergeFileSelector'
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
      minFiles={2}
      processFn={processMerge}
      customFileInput={({ onFilesSelected, selectedFiles }) => (
        <MergeFileSelector
          accept="audio/*"
          onFilesSelected={onFilesSelected}
          selectedFiles={selectedFiles}
        />
      )}
    />
  )
}

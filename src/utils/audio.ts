const AUDIO_EXTENSIONS = new Set([
  'mp3',
  'wav',
  'm4a',
  'ogg',
  'flac',
  'aac',
  'webm',
  'opus',
  'wma',
])

export function isAudioFile(file: File): boolean {
  if (file.type && file.type.startsWith('audio/')) return true
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext ? AUDIO_EXTENSIONS.has(ext) : false
}

export function filterAudioFiles(files: File[]): File[] {
  return files.filter(isAudioFile)
}

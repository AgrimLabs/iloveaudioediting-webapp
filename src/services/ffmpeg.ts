/**
 * FFmpeg.wasm service - lazy-loaded, runs in browser.
 * Uses single-thread build (no SharedArrayBuffer/COOP headers needed).
 * Loads from CDN on first use (~25MB).
 */
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const CORE_VERSION = '0.12.10'
const BASE_URL = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/esm`

let ffmpegInstance: FFmpeg | null = null
let loadPromise: Promise<FFmpeg> | null = null

export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg()
    await ffmpeg.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    ffmpegInstance = ffmpeg
    return ffmpeg
  })()

  return loadPromise
}

export async function trimAudio(
  file: File,
  startSeconds: number,
  endSeconds: number
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg()
  const inputName = 'input' + getExtension(file.name)
  const outputName = 'output' + getExtension(file.name)

  await ffmpeg.writeFile(inputName, await fetchFile(file))
  await ffmpeg.exec([
    '-i', inputName,
    '-ss', String(startSeconds),
    '-to', String(endSeconds),
    '-c', 'copy',
    outputName,
  ])
  const data = await ffmpeg.readFile(outputName)
  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)

  return new Blob([data as BlobPart], { type: file.type })
}

export async function mergeAudio(files: File[]): Promise<Blob> {
  const ffmpeg = await loadFFmpeg()

  // Write all files and create concat list
  for (let i = 0; i < files.length; i++) {
    const name = `input_${i}${getExtension(files[i].name)}`
    await ffmpeg.writeFile(name, await fetchFile(files[i]))
  }
  const listContent = files
    .map((_, i) => `file 'input_${i}${getExtension(files[i].name)}'`)
    .join('\n')
  await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(listContent))

  await ffmpeg.exec([
    '-f', 'concat',
    '-safe', '0',
    '-i', 'concat.txt',
    '-c', 'copy',
    'output.mp3',
  ])

  const data = await ffmpeg.readFile('output.mp3')
  for (let i = 0; i < files.length; i++) {
    await ffmpeg.deleteFile(`input_${i}${getExtension(files[i].name)}`)
  }
  await ffmpeg.deleteFile('concat.txt')
  await ffmpeg.deleteFile('output.mp3')

  return new Blob([data as BlobPart], { type: 'audio/mpeg' })
}

export type OutputFormat = 'mp3' | 'm4a' | 'wav'

export async function convertAudio(
  file: File,
  format: OutputFormat
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg()
  const inputName = 'input' + getExtension(file.name)
  const outputName = `output.${format}`

  await ffmpeg.writeFile(inputName, await fetchFile(file))

  const formatArgs: Record<OutputFormat, string[]> = {
    mp3: ['-acodec', 'libmp3lame', '-q:a', '2'],
    m4a: ['-acodec', 'aac'],
    wav: ['-acodec', 'pcm_s16le'],
  }
  await ffmpeg.exec([
    '-i', inputName,
    ...formatArgs[format],
    outputName,
  ])

  const data = await ffmpeg.readFile(outputName)
  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)

  const mimeTypes: Record<OutputFormat, string> = {
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    wav: 'audio/wav',
  }
  return new Blob([data as BlobPart], { type: mimeTypes[format] })
}

function getExtension(filename: string): string {
  const ext = filename.split('.').pop()
  return ext ? `.${ext}` : '.mp3'
}

# iLoveAudio

Offline-first audio utility app. Trim, merge, and convert audio files directly in your browser. No login, no uploads, no server.

## Features

- **Trim Audio** – Cut audio to exact start/end times
- **Merge Audio** – Combine multiple files into one
- **Convert Audio** – Convert between MP3, M4A, and WAV

All processing runs locally via FFmpeg.wasm. Files never leave your device.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- FFmpeg.wasm (client-side)
- PWA (offline support)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview   # Preview production build
```

## Offline Use

1. Visit the app once while online (loads ~25MB FFmpeg.wasm)
2. Add to Home Screen (PWA) for app-like experience
3. Works offline after first load

## Project Structure

```
src/
├── components/     # ToolCard, FileDropzone, ToolShell, etc.
├── pages/          # Home, TrimTool, MergeTool, ConvertTool
├── services/       # ffmpeg.ts (FFmpeg.wasm wrapper)
└── App.tsx
```

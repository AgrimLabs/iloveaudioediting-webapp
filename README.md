# iLoveAudio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Offline-first audio utility app. Trim, merge, and convert audio files directly in your browser. No login, no uploads, no server. Inspired by [iLovePDF](https://www.ilovepdf.com/).

## Features

- **Trim Audio** – Cut audio to exact start/end times
- **Merge Audio** – Combine multiple files (supports mixed formats: MP3, M4A, WAV)
- **Convert Audio** – Convert between MP3, M4A, and WAV

All processing runs locally via [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm). Files never leave your device.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- FFmpeg.wasm (client-side)
- PWA (offline support)

## Getting Started

### Prerequisites

- Node.js 18+

### Install & Run

```bash
git clone https://github.com/AgrimLabs/iloveaudioediting-webapp.git
cd iloveaudioediting-webapp
npm install
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
npm run preview   # Preview production build
```

## Deployment

The app is a static SPA. Deploy the `dist/` folder to any static host:

- **Vercel**: `vercel`
- **Netlify**: Drag `dist/` or connect repo
- **GitHub Pages**: Set `base: '/repo-name/'` in `vite.config.ts` and deploy `dist/`

## Offline Use

1. Visit the app once while online (loads ~25MB FFmpeg.wasm)
2. Add to Home Screen (PWA) for app-like experience
3. Works offline after first load

## Project Structure

```
src/
├── components/     # ToolCard, FileDropzone, ToolShell, MergeFileSelector
├── pages/          # Home, TrimTool, MergeTool, ConvertTool
├── services/       # ffmpeg.ts (FFmpeg.wasm wrapper)
└── App.tsx
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)

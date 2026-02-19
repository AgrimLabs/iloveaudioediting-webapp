import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { TrimTool } from './pages/TrimTool'
import { MergeTool } from './pages/MergeTool'
import { ConvertTool } from './pages/ConvertTool'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trim" element={<TrimTool />} />
        <Route path="/merge" element={<MergeTool />} />
        <Route path="/convert" element={<ConvertTool />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

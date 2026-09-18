import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Canvas from './components/Canvas'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Canvas />
  </StrictMode>,
)

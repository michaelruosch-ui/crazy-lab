import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import { App } from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root-Element #root wurde nicht gefunden.')
}

createRoot(rootElement).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)

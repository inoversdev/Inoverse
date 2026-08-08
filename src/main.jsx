import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SpaceApp from './SpaceApp'
import { ThemeProvider } from './theme'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SpaceApp />
    </ThemeProvider>
  </React.StrictMode>
)

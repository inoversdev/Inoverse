import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import SpaceApp from './SpaceApp'
import { ThemeProvider } from './theme'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <SpaceApp />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)

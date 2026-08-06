import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SpaceApp from './SpaceApp'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SpaceApp />
  </React.StrictMode>
)

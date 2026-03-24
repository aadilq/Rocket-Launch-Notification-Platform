import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import Launches from './pages/Launches.jsx'
import Subscribe from './pages/Subscribe.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Subscribe />
  </StrictMode>,
)

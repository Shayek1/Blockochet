import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Blockochet from "./Blockochet.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Blockochet/>
  </StrictMode>,
)

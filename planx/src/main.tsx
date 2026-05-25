import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PlanXStoreProvider } from '@/store/PlanXStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlanXStoreProvider>
      <App />
    </PlanXStoreProvider>
  </StrictMode>
)

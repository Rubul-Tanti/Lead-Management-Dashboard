import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ContextProvider } from './contextProvider/index.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'

const queryClient = new QueryClient()
const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID||''
createRoot(document.getElementById('root')!).render(
  <StrictMode>
       <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <ContextProvider>
      <GoogleOAuthProvider clientId={clientId}>
           <App />
           </GoogleOAuthProvider>
    </ContextProvider>
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

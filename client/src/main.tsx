import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ContextProvider } from './contextProvider/index.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AuthGuard from './lib/authGaurd.tsx'
import { ToastContainer } from 'react-toastify'

const queryClient = new QueryClient()
const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID||''
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
       <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
    <ContextProvider>
           <AuthGuard>
    <ToastContainer position="top-right"
    autoClose={5000}
    hideProgressBar={false}/>
           <App />
           </AuthGuard>
    </ContextProvider>
           </GoogleOAuthProvider>
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)

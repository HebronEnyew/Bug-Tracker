import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider  from "./auths/AuthContext"
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>                    
      <BrowserRouter>                 
        <App />                       
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)

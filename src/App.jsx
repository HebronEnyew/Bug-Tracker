import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './auths/login'
import Signup from './auths/signup'
import Projects from './pages/Projects'
import useAuth from './auths/useAuth'
import AuthProvider  from "./auths/AuthContext.jsx"

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()


  // Show loading while checking auth - prevents early redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    )
  }

  // Only redirect if NOT authenticated AND loading is finished
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>  
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/projects" element={<Projects />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all: redirect unknown paths to dashboard (or login if you prefer) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </AuthProvider>
  )
}

export default App
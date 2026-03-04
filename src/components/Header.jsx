import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../auths/useAuth'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false)

      // Supabase logout
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Supabase logout failed:', error)
        alert('Logout failed. Please try again.')
        return
      }

      // Call my context logout to clear local auth state
      logout()

      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout error:', err)
      alert('Something went wrong during logout')
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-20 bg-black/60 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8" >
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')
          }>
            <div className="flex items-center gap-2">
              <div className="w-[50px] h-[50px] rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-extrabold text-2xl">BT</div>
              <div className="hidden sm:block">
                <span className="text-md font-bold text-white text-flex align-bottom">Bug Tracker</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="md:flex sm:flex items-center gap-4 text-sm text-gray-400">
              <Link to="/dashboard" className="hover:text-white text-white">Dashboard</Link>
              <Link to="/projects" className="hover:text-white text-white">Projects</Link>
            </nav>

            <div className="relative dropdown-container">
              <button
                className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center ring-1 ring-gray-700"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/>
                </svg>
              </button>

              {isDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {user?.user_metadata?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email || 'email@example.com'}
                    </p>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
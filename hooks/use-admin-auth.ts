"use client"

import { useState, useEffect } from "react"

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuth = () => {
      const isAuth = sessionStorage.getItem('admin_authenticated') === 'true'
      const loginTime = sessionStorage.getItem('admin_login_time')
      
      if (isAuth && loginTime) {
        // Check if session is still valid (24 hours)
        const loginTimestamp = parseInt(loginTime, 10)
        const now = Date.now()
        const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        
        if (now - loginTimestamp < sessionDuration) {
          setIsAuthenticated(true)
        } else {
          // Session expired, clear storage
          sessionStorage.removeItem('admin_authenticated')
          sessionStorage.removeItem('admin_login_time')
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
      
      setIsLoading(false)
    }

    checkAuth()

    // Listen for storage changes (in case user logs out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_authenticated') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  }
}

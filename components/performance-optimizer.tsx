'use client'

import { useEffect } from 'react'
import { initPerformanceOptimizations } from '@/lib/performance'
import { config } from '@/lib/config'

/**
 * Client component that initializes performance optimizations
 * This component doesn't render anything visible
 */
export function PerformanceOptimizer() {
  useEffect(() => {
    // Initialize performance optimizations
    initPerformanceOptimizations()
    
    // Preconnect to API domain
    const apiUrl = config.api.baseUrl
    if (apiUrl) {
      try {
        const url = new URL(apiUrl)
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = url.origin
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      } catch (e) {
        console.error('Invalid API URL for preconnect:', apiUrl)
      }
    }
    
    // Add DNS prefetch for API domain
    if (apiUrl) {
      try {
        const url = new URL(apiUrl)
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = url.origin
        document.head.appendChild(link)
      } catch (e) {
        console.error('Invalid API URL for dns-prefetch:', apiUrl)
      }
    }
  }, [])

  return null
}

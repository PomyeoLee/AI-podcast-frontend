import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Application configuration with environment variables
 * This centralizes all environment variable access and provides defaults
 */
export const config = {
  /**
   * API configuration
   */
  api: {
    // Use environment variable with fallback
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://ai-podcast-api-202278901138.us-west1.run.app",
  },
  
  /**
   * Cache configuration
   */
  cache: {
    // Reduced cache duration for faster updates when episodes are deleted (1 minute)
    duration: process.env.NEXT_PUBLIC_CACHE_DURATION 
      ? parseInt(process.env.NEXT_PUBLIC_CACHE_DURATION, 10) 
      : 1 * 60 * 1000,
  },

  /**
   * UI configuration
   */
  ui: {
    // Default background image for hero section
    defaultBackgroundUrl: process.env.NEXT_PUBLIC_DEFAULT_BACKGROUND_URL || "/placeholder.jpg",
  }
}

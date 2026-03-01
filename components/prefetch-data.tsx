'use client'

import { useEffect } from 'react'
import { fetchPodcastTitles, fetchPodcastDetails } from '@/lib/api'

interface PrefetchDataProps {
  prefetchDates?: string[]
}

/**
 * Component that prefetches data in the background
 * This helps improve perceived performance by loading data before it's needed
 */
export function PrefetchData({ prefetchDates = [] }: PrefetchDataProps) {
  useEffect(() => {
    // Function to prefetch data
    const prefetchData = async () => {
      try {
        // First, prefetch the podcast titles (main page data)
        const titles = await fetchPodcastTitles()
        
        // Then, prefetch specific podcast details if dates are provided
        if (prefetchDates.length > 0) {
          // Use Promise.all to fetch multiple podcasts in parallel
          await Promise.all(
            prefetchDates.map(date => fetchPodcastDetails(date))
          )
        } else if (titles.length > 0) {
          // If no specific dates provided, prefetch the most recent podcast
          await fetchPodcastDetails(titles[0].date)
        }
        
        console.log('[Prefetch] Successfully prefetched data')
      } catch (error) {
        console.error('[Prefetch] Error prefetching data:', error)
      }
    }

    // Use requestIdleCallback if available, otherwise setTimeout
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        // @ts-ignore - TypeScript doesn't recognize requestIdleCallback
        window.requestIdleCallback(() => {
          prefetchData()
        })
      } else {
        // Fallback to setTimeout with a delay
        setTimeout(prefetchData, 1000)
      }
    }
  }, [prefetchDates])

  // This component doesn't render anything
  return null
}

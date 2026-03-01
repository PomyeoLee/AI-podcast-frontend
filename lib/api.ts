import type { PodcastTitle, PodcastDetails, ApiInfo } from "@/types/podcast"
import { cachedFetch } from "@/lib/cache"
import { config } from "@/lib/config"

const API_BASE_URL = config.api.baseUrl

/**
 * Fetch API information
 */
export async function fetchApiInfo(): Promise<ApiInfo | null> {
  return cachedFetch('api_info', async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching API info:', error)
      return null
    }
  })
}

/**
 * Fetch all podcast titles
 */
export async function fetchPodcastTitles(): Promise<PodcastTitle[]> {
  return cachedFetch('podcast_titles', async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/podcasts/titles`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      // Sort by date string directly (format should be YYYY-MM-DD)
      return data.sort((a: PodcastTitle, b: PodcastTitle) => 
        b.date.localeCompare(a.date)
      )
    } catch (error) {
      console.error('Error fetching podcast titles:', error)
      return []
    }
  })
}

/**
 * Fetch specific podcast details
 */
export async function fetchPodcastDetails(date: string): Promise<PodcastDetails | null> {
  return cachedFetch(`podcast_details_${date}`, async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/podcasts/day/${date}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching podcast for date ${date}:`, error)
      return null
    }
  })
}

interface BackgroundOverride {
  originalUrl: string
  overrideUrl: string
  createdAt: string
}

interface OverrideData {
  overrides: BackgroundOverride[]
  lastUpdated: string | null
}

/**
 * Get background overrides from server
 */
export async function getBackgroundOverrides(): Promise<BackgroundOverride[]> {
  try {
    const response = await fetch('/api/background-overrides', {
      cache: 'no-store' // Always get fresh data
    })
    
    if (!response.ok) {
      console.error('Failed to fetch background overrides:', response.statusText)
      return []
    }
    
    const data: OverrideData = await response.json()
    return data.overrides || []
  } catch (error) {
    console.error('Error loading background overrides:', error)
    return []
  }
}

/**
 * Apply background override if one exists for the given URL
 * This function prioritizes API updates - if the API provides a different URL
 * than what was originally overridden, the API version takes priority
 */
export async function applyBackgroundOverride(
  currentUrl: string, 
  apiUrls: string[] = []
): Promise<string> {
  const overrides = await getBackgroundOverrides()
  if (overrides.length === 0) return currentUrl
  
  // Check if the current URL has an override
  const override = overrides.find(o => o.originalUrl === currentUrl)
  if (!override) return currentUrl
  
  // If API has provided new URLs that are different from the original override,
  // prioritize the API version
  const hasNewApiUrl = apiUrls.some(url => 
    url !== override.originalUrl && url !== override.overrideUrl
  )
  
  if (hasNewApiUrl) {
    console.log(`[Background Override] API provided new URL, using API version instead of override`)
    return currentUrl
  }
  
  console.log(`[Background Override] Applying override: ${override.originalUrl} -> ${override.overrideUrl}`)
  return override.overrideUrl
}

/**
 * Add or update a background override
 */
export async function saveBackgroundOverride(originalUrl: string, overrideUrl: string): Promise<boolean> {
  try {
    const response = await fetch('/api/background-overrides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl, overrideUrl }),
    })
    
    if (!response.ok) {
      console.error('Failed to save background override:', response.statusText)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error saving background override:', error)
    return false
  }
}

/**
 * Remove a background override
 */
export async function removeBackgroundOverride(originalUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/background-overrides?originalUrl=${encodeURIComponent(originalUrl)}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      console.error('Failed to remove background override:', response.statusText)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error removing background override:', error)
    return false
  }
}

/**
 * Get all original URLs that have been seen from the API (client-side tracking)
 * This helps track which URLs are from the API vs user overrides
 */
export function trackApiBackgroundUrl(url: string): void {
  if (typeof window === 'undefined' || !url) return
  
  try {
    const key = 'apiBackgroundUrls'
    const existing = localStorage.getItem(key)
    const urls: string[] = existing ? JSON.parse(existing) : []
    
    if (!urls.includes(url)) {
      urls.push(url)
      // Keep only the last 50 URLs to prevent localStorage bloat
      const trimmed = urls.slice(-50)
      localStorage.setItem(key, JSON.stringify(trimmed))
    }
  } catch (error) {
    console.error('Error tracking API background URL:', error)
  }
}

/**
 * Get all URLs that have been seen from the API (client-side tracking)
 */
export function getApiBackgroundUrls(): string[] {
  if (typeof window === 'undefined') return []
  
  try {
    const saved = localStorage.getItem('apiBackgroundUrls')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error loading API background URLs:', error)
    return []
  }
}

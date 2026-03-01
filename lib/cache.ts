import { config } from "@/lib/config";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  staleWhileRevalidate?: boolean;
  sessionId: string;
};

const CACHE_DURATION = config.cache.duration;
const cache = new Map<string, CacheEntry<any>>();

// Generate a unique session ID when the module loads
const SESSION_ID = Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Store pending promises to avoid duplicate requests
const pendingPromises = new Map<string, Promise<any>>();

/**
 * Wrapper for fetch that implements caching
 * @param key Unique key for the cache entry
 * @param fetchFn Function that returns a promise with the data
 * @param duration Optional cache duration in milliseconds
 */
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  duration: number = CACHE_DURATION
): Promise<T> {
  // Check if we have a valid cache entry
  const entry = cache.get(key);
  const now = Date.now();
  
  // If we have a valid cache entry from the current session, return it immediately
  if (entry && entry.sessionId === SESSION_ID && now - entry.timestamp < duration) {
    console.log(`[Cache] Using cached data for ${key}`);
    
    // If the entry is stale but still usable, trigger a background refresh
    if (entry.staleWhileRevalidate && now - entry.timestamp > (duration * 0.75)) {
      console.log(`[Cache] Background refreshing stale data for ${key}`);
      refreshCacheInBackground(key, fetchFn);
    }
    
    return entry.data;
  }
  
  // If entry exists but is from a different session, remove it
  if (entry && entry.sessionId !== SESSION_ID) {
    console.log(`[Cache] Removing stale cache entry from previous session for ${key}`);
    cache.delete(key);
  }
  
  // Check if we have a pending promise for this key
  if (pendingPromises.has(key)) {
    console.log(`[Cache] Reusing pending request for ${key}`);
    return pendingPromises.get(key)!;
  }
  
  // If cache entry is expired but exists, mark it for stale-while-revalidate
  if (entry) {
    entry.staleWhileRevalidate = true;
  }
  
  // Create and store the promise
  const fetchPromise = fetchAndCache(key, fetchFn);
  pendingPromises.set(key, fetchPromise);
  
  try {
    // If we have a stale entry, return it immediately while fetching in background
    if (entry?.staleWhileRevalidate) {
      console.log(`[Cache] Using stale data for ${key} while revalidating`);
      refreshCacheInBackground(key, fetchFn);
      return entry.data;
    }
    
    // Otherwise wait for the fetch to complete
    return await fetchPromise;
  } finally {
    // Clean up the pending promise
    pendingPromises.delete(key);
  }
}

/**
 * Fetch data and update cache
 */
async function fetchAndCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  console.log(`[Cache] Fetching fresh data for ${key}`);
  try {
    const data = await fetchFn();
    // Store in cache with current session ID
    cache.set(key, { 
      data, 
      timestamp: Date.now(),
      staleWhileRevalidate: false,
      sessionId: SESSION_ID
    });
    return data;
  } catch (error) {
    console.error(`[Cache] Error fetching data for ${key}:`, error);
    // Remove from pending promises to allow retry
    pendingPromises.delete(key);
    throw error;
  }
}

/**
 * Refresh cache in background without blocking
 */
function refreshCacheInBackground<T>(key: string, fetchFn: () => Promise<T>): void {
  // Don't await this promise - let it run in background
  fetchAndCache(key, fetchFn).catch(err => {
    console.error(`[Cache] Background refresh failed for ${key}:`, err);
  });
}

/**
 * Clear the entire cache or a specific entry
 * @param key Optional key to clear specific entry
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Format a date string to a more readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

/**
 * Check if a user role has admin privileges
 */
export function isAdmin(role?: string): boolean {
  if (!role) return false
  return ["admin", "editor", "author"].includes(role.toLowerCase())
}

/**
 * Calculate reading time for a given text
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

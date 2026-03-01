import type { PodcastEpisode, PodcastMetadata } from "@/types/podcast"

/**
 * Format duration from seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

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
 * Parse markdown frontmatter and content
 */
export function parseMarkdown(content: string): { metadata: PodcastMetadata; content: string } {
  const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)$/s
  const match = content.match(frontmatterRegex)

  if (!match) {
    throw new Error("Invalid markdown format")
  }

  const [, frontmatter, markdownContent] = match
  const metadata = {} as PodcastMetadata

  // Parse YAML-like frontmatter
  frontmatter.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":")
    if (key && valueParts.length > 0) {
      const value = valueParts
        .join(":")
        .trim()
        .replace(/^["']|["']$/g, "")
      if (key.trim() === "tags") {
        metadata.tags = value.split(",").map((tag) => tag.trim())
      } else {
        ;(metadata as any)[key.trim()] = value
      }
    }
  })

  return { metadata, content: markdownContent.trim() }
}

/**
 * Get all podcast episodes from the API
 */
export async function getAllPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const { fetchPodcastTitles, fetchPodcastDetails } = await import('@/lib/api')
  
  try {
    // Get all podcast titles first
    const titles = await fetchPodcastTitles()
    
    // Fetch full details for each podcast
    const episodes = await Promise.all(
      titles.map(async (title) => {
        const details = await fetchPodcastDetails(title.date)
        if (!details) return null
        
        // Create a podcast episode from the API response
        const episode: PodcastEpisode = {
          slug: title.date, // Use the date as the slug
          title: details.title,
          description: details.description,
          shortDescription: details.description.split('.')[0] + '.', // Use first sentence as short description
          coverImage: "/placeholder.svg?height=400&width=400", // Use placeholder image
          audioFile: details.mp3_url, // Map mp3_url to audioFile
          publishedAt: details.date,
          duration: "00:00", // Duration not provided by API
          tags: [], // Tags not provided by API
        }
        return episode
      })
    )
    
    // Filter out any null results and sort by date
    return episodes
      .filter((episode): episode is PodcastEpisode => episode !== null)
      .sort((a, b) => {
        if (!a || !b) return 0
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      })
      
  } catch (error) {
    console.error('Error fetching podcast episodes:', error)
    return []
  }
}

/**
 * Get a single podcast episode by slug
 */
export async function getPodcastEpisode(slug: string): Promise<PodcastEpisode | null> {
  const episodes = await getAllPodcastEpisodes()
  return episodes.find((episode) => episode.slug === slug) || null
}

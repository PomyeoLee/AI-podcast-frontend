export interface PodcastEpisode {
  slug: string
  title: string
  description: string
  shortDescription: string
  coverImage: string
  audioFile: string
  publishedAt: string
  duration: string
  season?: number
  episode?: number
  tags: string[]
}

export interface PodcastMetadata {
  title: string
  description: string
  publishedAt: string
  tags: string[]
}

export interface PodcastTitle {
  date: string
  title: string
  background_url: string
}

export interface PodcastDetails {
  date: string
  title: string
  description: string
  mp3_url: string
  metadata_url: string
}

export interface ApiInfo {
  name: string
  version: string
  endpoints: Array<{
    path: string
    description: string
  }>
}

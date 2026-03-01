export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  readingTime?: number
  author: {
    name: string
    avatar?: string
    role?: string
  }
}

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Hash } from "lucide-react"
import { formatDate } from "@/lib/podcast"
import type { PodcastEpisode } from "@/types/podcast"

interface PodcastCardProps {
  episode: PodcastEpisode
  variant?: "default" | "featured"
}

export function PodcastCard({ episode, variant = "default" }: PodcastCardProps) {
  const isFeatured = variant === "featured"

  return (
    <div className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/podcast/${episode.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={episode.coverImage || "/placeholder.svg"}
            alt={episode.title}
            fill
            sizes={isFeatured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6 space-y-3">
          {(episode.season || episode.episode) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-3 w-3" />
              {episode.season && `S${episode.season}`}
              {episode.season && episode.episode && " • "}
              {episode.episode && `E${episode.episode}`}
            </div>
          )}

          <h3
            className={`font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 ${isFeatured ? "text-xl" : "text-lg"}`}
          >
            {episode.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-3">{episode.shortDescription}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={episode.publishedAt}>{formatDate(episode.publishedAt)}</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{episode.duration}</span>
            </div>
          </div>

          {episode.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {episode.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                  {tag}
                </span>
              ))}
              {episode.tags.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                  +{episode.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

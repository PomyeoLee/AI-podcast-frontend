"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Play } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { formatPodcastDate } from "@/lib/utils-podcast"
import type { PodcastTitle } from "@/types/podcast"

interface PodcastListCardProps {
  podcast: PodcastTitle
}

export function PodcastListCard({ podcast }: PodcastListCardProps) {
  const router = useRouter()
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/podcast/${podcast.date}`)
  }
  
  return (
    <Link href={`/podcast/${podcast.date}`} className="block">
      <div className="group bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Calendar className="h-4 w-4" />
            <time dateTime={podcast.date}>{formatPodcastDate(podcast.date)}</time>
          </div>
          
          <h3 className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
            {podcast.title}
          </h3>
        </div>

        <Button 
          onClick={handleButtonClick} 
          className="ml-4 flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Listen Now
        </Button>
        </div>
      </div>
    </Link>
  )
}

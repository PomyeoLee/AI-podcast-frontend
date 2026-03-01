"use client"

import { useState } from "react"
import { PodcastListCard } from "@/components/podcast-list-card"
import { Button } from "@/components/ui/button"
import type { PodcastTitle } from "@/types/podcast"

const INITIAL_COUNT = 10

interface PodcastListWithViewMoreProps {
  podcasts: PodcastTitle[]
}

export function PodcastListWithViewMore({ podcasts }: PodcastListWithViewMoreProps) {
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? podcasts : podcasts.slice(0, INITIAL_COUNT)
  const hasMore = podcasts.length > INITIAL_COUNT

  return (
    <div className="space-y-4">
      {visible.map((podcast) => (
        <PodcastListCard key={podcast.date} podcast={podcast} />
      ))}

      {hasMore && !showAll && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            View More ({podcasts.length - INITIAL_COUNT} more episodes)
          </Button>
        </div>
      )}
    </div>
  )
}

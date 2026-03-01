import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function SkeletonPodcastCard() {
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <Skeleton className="h-6 w-3/4" />
        </div>

        <Skeleton className="h-10 w-28 rounded-md ml-4" />
      </div>
    </div>
  )
}

export function SkeletonPodcastList() {
  return (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, index) => (
        <SkeletonPodcastCard key={index} />
      ))}
    </div>
  )
}

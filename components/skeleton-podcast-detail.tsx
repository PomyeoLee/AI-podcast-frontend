import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonPodcastDetail() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        <Skeleton className="h-10 w-3/4" />

        <Skeleton className="h-16 w-full rounded-lg" />
      </div>

      {/* Audio player skeleton */}
      <Skeleton className="h-24 w-full rounded-lg" />

      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <Skeleton className="h-10 w-40 rounded-md" />
    </div>
  )
}

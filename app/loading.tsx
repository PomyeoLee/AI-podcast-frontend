import { SkeletonPodcastList } from "@/components/skeleton-podcast-card"

export default function HomeLoading() {
  return (
    <main className="container max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="h-10 w-3/4 mx-auto bg-muted animate-pulse rounded-lg mb-4"></div>
        <div className="h-6 w-2/3 mx-auto bg-muted animate-pulse rounded-lg"></div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-40 bg-muted animate-pulse rounded-lg"></div>
        </div>

        <SkeletonPodcastList />
      </section>
    </main>
  )
}

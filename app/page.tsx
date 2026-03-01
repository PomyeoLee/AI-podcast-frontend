import { PodcastListWithViewMore } from "@/components/podcast-list-with-view-more"
import { fetchPodcastTitles } from "@/lib/api"
import { Suspense } from 'react'
import { SkeletonPodcastList } from "@/components/skeleton-podcast-card"
import { HeroSection } from "@/components/hero-section"

// Use ISR instead of dynamic rendering
export const revalidate = 300 // Revalidate every 5 minutes


function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-destructive mb-4">{message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="text-primary hover:underline"
      >
        Try again
      </button>
    </div>
  )
}

async function PodcastList() {
  const podcasts = await fetchPodcastTitles()

  if (podcasts.length === 0) {
    return <ErrorMessage message="No podcasts available at the moment." />
  }

  return <PodcastListWithViewMore podcasts={podcasts} />
}

async function HeroSectionWrapper() {
  const podcasts = await fetchPodcastTitles()
  return <HeroSection podcasts={podcasts} />
}

export default function HomePage() {
  return (
    <main className="relative">
      {/* Hero Section with Background */}
      <Suspense fallback={null}>
        <HeroSectionWrapper />
      </Suspense>

      {/* Latest Episodes Section */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Latest Episodes</h2>
        </div>

        <Suspense fallback={<SkeletonPodcastList />}>
          <PodcastList />
        </Suspense>
      </section>
    </main>
  )
}

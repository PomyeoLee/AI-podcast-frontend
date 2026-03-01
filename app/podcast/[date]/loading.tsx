import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SkeletonPodcastDetail } from "@/components/skeleton-podcast-detail"

export default function PodcastLoading() {
  return (
    <main className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Episodes
          </Link>
        </Button>
      </div>
      
      <SkeletonPodcastDetail />
    </main>
  )
}

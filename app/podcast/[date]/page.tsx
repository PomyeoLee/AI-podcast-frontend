import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, ExternalLink, Link2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { EnhancedAudioPlayer } from "@/components/enhanced-audio-player"
import { fetchPodcastDetails } from "@/lib/api"
import { formatPodcastDate, formatDescription, extractSource } from "@/lib/utils-podcast"

// Replace HTML links created from [>Read more](URL) patterns with inline source buttons
function replaceReadMoreWithSourceButtons(content: string): string {
  // Pattern to match HTML links with ">Read more" text
  const pattern = /<a href="(https?:\/\/[^"]+)"[^>]*>>Read more<\/a>/g;
  
  return content.replace(pattern, (match, url) => {
    return ` <a href="${url}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 2px; font-size: 0.75rem; padding: 2px 6px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #374151; text-decoration: none; margin-left: 4px; vertical-align: baseline; white-space: nowrap;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="11" y1="13" x2="13" y2="11"></line></svg>Source</a>`;
  });
}

// Force dynamic rendering to fetch data on each request
export const dynamic = 'force-dynamic'

interface PodcastPageProps {
  params: {
    date: string
  }
}

// Remove the generateStaticParams function to prevent static generation

export default async function PodcastPage({ params }: PodcastPageProps) {
  const { date } = await params
  const podcast = await fetchPodcastDetails(date)

  if (!podcast) {
    notFound()
  }

  const { source, content } = extractSource(podcast.description)
  
  // Format the description and replace [>Read more](URL) patterns with source buttons
  const formattedContent = await formatDescription(content)
  const contentWithSourceButtons = replaceReadMoreWithSourceButtons(formattedContent)

  return (
    <main className="container max-w-4xl mx-auto px-4 pt-20 md:pt-24 pb-8">
      <div className="mb-6 md:mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Episodes
          </Link>
        </Button>
      </div>

      <article className="space-y-6 md:space-y-8">
        <header className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={podcast.date}>{formatPodcastDate(podcast.date)}</time>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {podcast.title}
          </h1>

          {source && (
            <div className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg p-3">
              <ExternalLink className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="font-medium">Source:</span>
                <span className="ml-1 break-words">{source}</span>
              </div>
            </div>
          )}
        </header>

        <EnhancedAudioPlayer 
          src={podcast.mp3_url} 
          title={podcast.title}
          date={podcast.date}
        />

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-xl md:text-2xl">Episode Description</h2>
          <div 
            className="text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: contentWithSourceButtons
            }}
          />
        </div>

        {podcast.metadata_url && (
          <div className="border-t pt-6">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a 
                href={podcast.metadata_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Metadata
              </a>
            </Button>
          </div>
        )}
      </article>
    </main>
  )
}

// This layout ensures proper routing for podcast pages
// Only the [date] dynamic route is used in this application
import { NavigationBanner } from "@/components/navigation-banner"

export default function PodcastLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavigationBanner />
      {children}
    </>
  )
}

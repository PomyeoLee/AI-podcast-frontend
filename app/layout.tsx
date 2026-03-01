import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { LoadingIndicator } from '@/components/loading-indicator'
import { NavigationBanner } from '@/components/navigation-banner'
import { PrefetchData } from '@/components/prefetch-data'
import { ThemeProvider } from '@/components/theme-provider'
import { PerformanceOptimizer } from '@/components/performance-optimizer'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'AI Podcast',
  description: 'AI Weekly News Podcast',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LoadingIndicator />
          <PrefetchData />
          <PerformanceOptimizer />
          <NavigationBanner />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

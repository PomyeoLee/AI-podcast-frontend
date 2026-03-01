"use client"

import { useEffect, useState } from "react"
import { config } from "@/lib/config"
import { applyBackgroundOverride, trackApiBackgroundUrl, getApiBackgroundUrls } from "@/lib/background-overrides"
import type { PodcastTitle } from "@/types/podcast"

interface HeroSectionProps {
  podcasts: PodcastTitle[]
}

export function HeroSection({ podcasts }: HeroSectionProps) {
  // Calculate initial background URL to prevent flicker
  const getInitialBackgroundUrl = () => {
    const latestPodcastWithImage = podcasts.find(podcast => podcast.background_url && podcast.background_url.trim() !== '')
    return latestPodcastWithImage?.background_url || config.ui.defaultBackgroundUrl
  }

  const [backgroundUrl, setBackgroundUrl] = useState<string>(getInitialBackgroundUrl())

  useEffect(() => {
    const applyOverrides = async () => {
      // Find the most recent podcast with a background_url
      const latestPodcastWithImage = podcasts.find(podcast => podcast.background_url && podcast.background_url.trim() !== '')
      const apiBackgroundUrl = latestPodcastWithImage?.background_url || config.ui.defaultBackgroundUrl

      // Track this URL as coming from the API
      if (apiBackgroundUrl !== config.ui.defaultBackgroundUrl) {
        trackApiBackgroundUrl(apiBackgroundUrl)
      }

      // Get all known API URLs for override priority logic
      const apiUrls = getApiBackgroundUrls()

      // Apply any background overrides
      const finalBackgroundUrl = await applyBackgroundOverride(apiBackgroundUrl, apiUrls)
      
      // Only update if the URL actually changed to prevent unnecessary re-renders
      if (finalBackgroundUrl !== backgroundUrl) {
        setBackgroundUrl(finalBackgroundUrl)
      }
    }

    applyOverrides()
  }, [podcasts, backgroundUrl])

  // Glass effect parameters (can be adjusted)
  const glassEffect = {
    bgOpacity: 10, // Percentage for white background opacity (0-100)
    blurAmount: "md", // Options: sm, md, lg
  }

  // Custom gradient transition parameters (easily adjustable)
  const gradientEffect = {
    height: "h-0", // Options: h-16, h-20, h-24, h-32, h-40, h-48, h-64
    intensity: "strong", // Options: "subtle", "medium", "strong"
    direction: "bottom", // Options: "bottom", "top"
    color: "white", // Options: "white", "black"
  }

  // Function to render the custom gradient effect
  const renderGradientEffect = () => {
    const intensityMap: Record<string, string> = {
      subtle: gradientEffect.color === "white" ? "to-white/60" : "to-black/30",
      medium: gradientEffect.color === "white" ? "to-white/80" : "to-black/50", 
      strong: gradientEffect.color === "white" ? "to-white" : "to-black/70"
    };

    const opacity = intensityMap[gradientEffect.intensity] || intensityMap.medium;
    const gradientDirection = gradientEffect.direction === "top" ? "bg-gradient-to-t" : "bg-gradient-to-b";
    const position = gradientEffect.direction === "top" ? "top-0" : "bottom-0";

    return (
      <div className={`absolute inset-x-0 ${position} ${gradientEffect.height} ${gradientDirection} from-transparent ${opacity}`} />
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('${backgroundUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "50% 50%", /* Explicit center positioning */
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
        }}
      />

      {/* Custom Gradient Effect */}
      {renderGradientEffect()}

      {/* Glass Effect Container */}
      <div className="relative container max-w-4xl mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="text-center space-y-6">
          {/* Glass effect background for text */}
          <div className={`backdrop-blur-${glassEffect.blurAmount} bg-white/${glassEffect.bgOpacity} rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 border border-white/20 shadow-2xl mx-auto max-w-3xl`}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-2xl leading-tight">
              AI Daily News Podcast
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-100 max-w-2xl mx-auto drop-shadow-lg mt-4 md:mt-6 leading-relaxed">
              Stay informed with our AI-generated daily news podcasts. Get the latest updates delivered in an engaging
              audio format.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

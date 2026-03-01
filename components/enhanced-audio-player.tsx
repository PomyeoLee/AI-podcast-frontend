"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Download, SkipBack, SkipForward } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDuration } from "@/lib/utils-podcast"

interface EnhancedAudioPlayerProps {
  src: string
  title?: string
  date?: string
}

export function EnhancedAudioPlayer({ src, title, date }: EnhancedAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => {
      setError("Failed to load audio file")
      setIsLoading(false)
    }
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [src])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || error) return

    try {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
      setIsPlaying(!isPlaying)
    } catch (err) {
      setError("Failed to play audio")
      console.error("Audio play error:", err)
    }
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = value[0]
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0]
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const skipTime = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handlePlaybackRateChange = (rate: string) => {
    const audio = audioRef.current
    if (!audio) return

    const newRate = parseFloat(rate)
    audio.playbackRate = newRate
    setPlaybackRate(newRate)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = `${title} - ${date}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (error) {
    return (
      <div className="bg-card border rounded-lg p-6 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4 md:space-y-6">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Main Controls */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button onClick={() => skipTime(-10)} variant="ghost" size="sm" disabled={isLoading} className="shrink-0">
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button 
          onClick={togglePlay} 
          size="lg" 
          className="rounded-full w-12 h-12 md:w-14 md:h-14 shrink-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-background border-t-transparent" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5 md:h-6 md:w-6" />
          ) : (
            <Play className="h-5 w-5 md:h-6 md:w-6 ml-0.5" />
          )}
        </Button>

        <Button onClick={() => skipTime(10)} variant="ghost" size="sm" disabled={isLoading} className="shrink-0">
          <SkipForward className="h-4 w-4" />
        </Button>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
          <Slider 
            value={[currentTime]} 
            max={duration} 
            step={1} 
            onValueChange={handleSeek} 
            className="w-full"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Secondary Controls - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center justify-between sm:justify-start space-x-3 sm:space-x-4">
          {/* Volume Control - Left on mobile */}
          <div className="flex items-center space-x-2">
            <Button onClick={toggleMute} variant="ghost" size="sm" className="shrink-0">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-16 sm:w-20"
            />
          </div>

          {/* Speed Control - Right on mobile */}
          <Select value={playbackRate.toString()} onValueChange={handlePlaybackRateChange}>
            <SelectTrigger className="w-16 sm:w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleDownload} variant="outline" size="sm" className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function NavigationBanner() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Set initial dark text for specific pages
  const shouldUseDarkText = isScrolled || 
    pathname === "/project-intro" || 
    pathname === "/about-me" || 
    pathname.startsWith("/podcast/")
  
  // Glass effect parameters (can be adjusted later)
  const glassEffect = {
    bgOpacity: 0, // Set to 0 for now, can be adjusted to add white background later (e.g., 0.05)
    blurAmount: "md", // Options: sm, md, lg
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 100)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const isActive = (path: string) => {
    const baseActiveClasses = `backdrop-blur-${glassEffect.blurAmount} border shadow-lg font-medium`
    const baseInactiveClasses = `hover:backdrop-blur-${glassEffect.blurAmount}`
    
    if (shouldUseDarkText) {
      return pathname === path 
        ? `${baseActiveClasses} bg-black/5 backdrop-blur-md border-black/10 text-black/80` 
        : `${baseInactiveClasses} text-black/60 hover:bg-black/5 hover:text-black/80`
    }
    
    return pathname === path 
      ? `${baseActiveClasses} bg-white/20 border-white/30 text-white` 
      : `${baseInactiveClasses} text-white/70 hover:bg-white/10 hover:text-white`
  }

  return (
    <div className={`backdrop-blur-${glassEffect.blurAmount} shadow-lg py-2 md:py-3 px-4 md:px-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      shouldUseDarkText
        ? "bg-white/80 border-b border-black/10" 
        : `bg-white/${glassEffect.bgOpacity} border-b border-white/20`
    }`}>
      <div className="container mx-auto flex items-center justify-center gap-1 sm:gap-4 md:gap-8">
        <Link href="/" className={`transition-all duration-200 px-2 sm:px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm sm:text-sm md:text-base whitespace-nowrap ${isActive("/")}`}>
          Home
        </Link>
        <Link href="/project-intro" className={`transition-all duration-200 px-2 sm:px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm sm:text-sm md:text-base whitespace-nowrap ${isActive("/project-intro")}`}>
          Project Intro
        </Link>
        <Link href="/about-me" className={`transition-all duration-200 px-2 sm:px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm sm:text-sm md:text-base whitespace-nowrap ${isActive("/about-me")}`}>
          About Me
        </Link>
      </div>
    </div>
  )
}

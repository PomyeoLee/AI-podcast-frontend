"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export function LoadingIndicator() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Start with a quick progress to 30%
    const timer1 = setTimeout(() => setProgress(30), 100)
    
    // Then slowly progress to 70%
    const timer2 = setTimeout(() => setProgress(70), 500)
    
    // After content is likely loaded, complete the progress
    const timer3 = setTimeout(() => {
      setProgress(100)
      // Hide after completion
      const timer4 = setTimeout(() => setVisible(false), 200)
      return () => clearTimeout(timer4)
    }, 1000)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-200 backdrop-blur-md bg-white/5 ${progress === 100 ? 'opacity-0' : 'opacity-100'}`}>
      <Progress value={progress} className="h-1 rounded-none bg-primary/20" />
    </div>
  )
}

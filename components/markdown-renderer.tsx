"use client"

import { useEffect, useState } from "react"
import { markdownToHtml } from "@/lib/markdown"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState<string>("")
  
  useEffect(() => {
    const renderMarkdown = async () => {
      const renderedHtml = await markdownToHtml(content)
      setHtml(renderedHtml)
    }
    
    renderMarkdown()
  }, [content])
  
  return (
    <div 
      className="markdown-content max-w-none text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

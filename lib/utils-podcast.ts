/**
 * Format date to user-friendly format
 */
export function formatPodcastDate(dateString: string): string {
  // Parse date string directly without timezone conversion
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day) // month is 0-indexed
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: 'UTC' // Use UTC to avoid timezone conversion
  }).format(date)
}

/**
 * Format duration from seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

import { markdownToHtml, isMarkdown } from '@/lib/markdown';

/**
 * Format description text for better readability
 * If the content appears to be Markdown, it will be converted to HTML
 */
export async function formatDescription(description: string): Promise<string> {
  if (!description) return '';
  
  // First, fix malformed [>Read more](URL patterns that are missing closing parenthesis
  // This handles cases like [>Read more](https://example.com] (missing closing parenthesis)
  let processedText = description.replace(/\[>Read more\]\((https?:\/\/[^\s\]]+)\]/g, '[>Read more]($1)');
  
  // Then handle the [>Read more](URL) patterns to ensure they stay inline
  // Replace standalone [>Read more](URL) patterns that are on their own lines (with or without asterisks)
  processedText = processedText
    .replace(/\n\n\*\[>Read more\]\((https?:\/\/[^)]+)\)\*/g, ' *[>Read more]($1)*')
    .replace(/\n\n\[>Read more\]\((https?:\/\/[^)]+)\)/g, ' [>Read more]($1)')
    .replace(/\n\*\[>Read more\]\((https?:\/\/[^)]+)\)\*/g, ' *[>Read more]($1)*')
    .replace(/\n\[>Read more\]\((https?:\/\/[^)]+)\)/g, ' [>Read more]($1)');
  
  // Split by newlines and filter out empty lines
  const lines = processedText.split('\n').filter(line => line.trim() !== '');
  
  // Join with proper spacing
  const formattedText = lines.join('\n\n');
  
  // Check if the content appears to be Markdown
  if (isMarkdown(formattedText)) {
    // Convert Markdown to HTML
    let htmlContent = await markdownToHtml(formattedText);
    
    return htmlContent;
  }
  
  // Return plain text with line breaks preserved
  return formattedText;
}

/**
 * Extract source from description if it starts with "Source:"
 */
export function extractSource(description: string): { source: string | null; content: string } {
  const lines = description.split('\n')
  const firstLine = lines[0]?.trim()
  
  if (firstLine?.startsWith('Source:')) {
    return {
      source: firstLine.replace('Source:', '').trim(),
      content: lines.slice(1).join('\n').trim()
    }
  }
  
  return {
    source: null,
    content: description
  }
}

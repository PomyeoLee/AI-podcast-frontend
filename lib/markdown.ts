import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

/**
 * Convert Markdown text to HTML
 * @param markdown The markdown text to convert
 * @returns HTML string
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return '';
  
  const result = await remark()
    .use(gfm)   // GitHub Flavored Markdown: tables, strikethrough, etc.
    .use(html)  // Convert to HTML
    .process(markdown);
    
  return result.toString();
}

/**
 * Check if content is likely Markdown
 * This helps determine whether to apply Markdown parsing
 */
export function isMarkdown(content: string): boolean {
  if (!content) return false;
  
  // Check for common Markdown patterns
  const markdownPatterns = [
    /^#+ /m,           // Headers
    /\*\*(.*?)\*\*/,   // Bold
    /\*(.*?)\*/,       // Italic
    /\[(.*?)\]\((.*?)\)/, // Links
    /^- /m,            // Unordered lists
    /^[0-9]+\. /m,     // Ordered lists
    /```[\s\S]*?```/,  // Code blocks
    /`[^`]+`/,         // Inline code
    /^> /m,            // Blockquotes
    /^\s*---\s*$/m     // Horizontal rules
  ];
  
  return markdownPatterns.some(pattern => pattern.test(content));
}

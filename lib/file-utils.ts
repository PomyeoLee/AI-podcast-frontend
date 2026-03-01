import fs from 'fs';
import path from 'path';
import { markdownToHtml } from './markdown';

/**
 * Read a Markdown file and convert it to HTML
 * @param filePath Path to the Markdown file (relative to the project root)
 * @returns HTML content
 */
export async function readMarkdownFile(filePath: string): Promise<string> {
  try {
    // Resolve the absolute path
    const absolutePath = path.resolve(process.cwd(), filePath);
    
    // Read the file
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    
    // Convert Markdown to HTML
    const htmlContent = await markdownToHtml(fileContent);
    
    return htmlContent;
  } catch (error) {
    console.error(`Error reading Markdown file ${filePath}:`, error);
    return `<p>Error loading content from ${filePath}</p>`;
  }
}

/**
 * Check if a file exists
 * @param filePath Path to the file (relative to the project root)
 * @returns Boolean indicating if the file exists
 */
export function fileExists(filePath: string): boolean {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    return fs.existsSync(absolutePath);
  } catch (error) {
    return false;
  }
}

/**
 * Get a list of Markdown files in a directory
 * @param dirPath Path to the directory (relative to the project root)
 * @returns Array of file paths
 */
export function getMarkdownFiles(dirPath: string): string[] {
  try {
    const absolutePath = path.resolve(process.cwd(), dirPath);
    
    if (!fs.existsSync(absolutePath)) {
      return [];
    }
    
    const files = fs.readdirSync(absolutePath);
    
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(dirPath, file));
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

import fs from 'fs'
import path from 'path'
import { MarkdownRenderer } from '@/components/markdown-renderer'

export const metadata = {
  title: 'Project Introduction',
  description: 'Learn about our project and its features',
}

export default async function ProjectIntroPage() {
  // Read the markdown file
  const markdownPath = path.join(process.cwd(), 'app/content/project-intro.md')
  const markdownContent = fs.readFileSync(markdownPath, 'utf8')
  
  return (
    <main className="container mx-auto pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="group bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-300">
          <MarkdownRenderer content={markdownContent} />
        </div>
      </div>
    </main>
  )
}

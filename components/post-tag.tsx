import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PostTagProps {
  tag: string
}

export function PostTag({ tag }: PostTagProps) {
  return (
    <Link href={`/blog/tag/${tag.toLowerCase()}`} className="no-underline">
      <span className="text-sm text-primary/70 hover:text-primary transition-colors duration-300">{tag}</span>
    </Link>
  )
}

interface PostTagsOverflowProps {
  tags: string[]
}

export function PostTagsOverflow({ tags }: PostTagsOverflowProps) {
  if (!tags.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-sm text-primary/70 hover:text-primary transition-colors duration-300 cursor-pointer focus:outline-none">
        <span className="flex items-center">
          <MoreHorizontal className="h-4 w-4 mr-1" />
          {tags.length} more
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {tags.map((tag) => (
          <DropdownMenuItem key={tag} asChild>
            <Link href={`/blog/tag/${tag.toLowerCase()}`} className="w-full">
              {tag}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

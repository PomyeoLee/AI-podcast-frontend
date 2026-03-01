import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PostTag, PostTagsOverflow } from "./post-tag"
import { PostActions } from "./post-actions"
import { formatDate, isAdmin } from "@/lib/blog"
import type { Post } from "@/types/post"

interface PostCardProps {
  post: Post
  variant?: "default" | "featured" | "wide"
  actions?: boolean
}

export function PostCard({ post, variant = "default", actions }: PostCardProps) {
  if (!post) return null

  const isWide = variant === "wide"
  const isFeatured = variant === "featured" || variant === "wide"
  const isAdminUser = isAdmin(post.author.role)

  // Show first x tags and the rest in the overflow dropdown
  const maxVisibleTags = isWide ? 3 : 2
  const visibleTags = post.tags.slice(0, maxVisibleTags)
  const overflowTags = post.tags.slice(maxVisibleTags)

  // Fallback image if the post image fails to load
  const imageSrc = post.coverImage || "/placeholder.svg"

  if (isWide) {
    return (
      <div className="group relative">
        {actions && isAdminUser && <PostActions postId={post.id} postTitle={post.title} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden rounded-lg bg-muted/20">
            <Link href={`/blog/${post.slug}`} prefetch={isFeatured} className="block h-full">
              <div className="absolute inset-0 bg-muted/10" />
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={post.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={isFeatured}
                loading={isFeatured ? "eager" : "lazy"}
                className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />
            </Link>
          </div>

          <div className="flex flex-col justify-center space-y-5">
            <div className="flex flex-wrap gap-3">
              {visibleTags.map((tag) => (
                <PostTag key={tag} tag={tag} />
              ))}
              {overflowTags.length > 0 && <PostTagsOverflow tags={overflowTags} />}
            </div>

            <Link href={`/blog/${post.slug}`} className="group/title">
              <h3 className="text-2xl font-medium tracking-tight text-foreground group-hover/title:text-primary transition-colors duration-300">
                {post.title}
              </h3>
            </Link>

            <p className="text-muted-foreground text-base leading-relaxed">{post.excerpt}</p>

            <div className="flex items-center text-sm text-muted-foreground pt-2">
              <span className="font-medium text-foreground">{post.author.name}</span>
              <span className="mx-2.5 text-muted-foreground/30">·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {post.readingTime && (
                <>
                  <span className="mx-2.5 text-muted-foreground/30">·</span>
                  <span>{post.readingTime} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("group relative flex flex-col space-y-5", isFeatured && "md:space-y-6")}>
      {actions && isAdminUser && <PostActions postId={post.id} postTitle={post.title} />}

      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted/20">
        <Link href={`/blog/${post.slug}`} prefetch={isFeatured}>
          <div className="absolute inset-0 bg-muted/10" />
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={post.title}
            fill
            sizes="100vw"
            priority={isFeatured}
            loading={isFeatured ? "eager" : "lazy"}
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="flex flex-col space-y-3">
        <div className="flex flex-wrap gap-3">
          {visibleTags.map((tag) => (
            <PostTag key={tag} tag={tag} />
          ))}
          {overflowTags.length > 0 && <PostTagsOverflow tags={overflowTags} />}
        </div>

        <Link href={`/blog/${post.slug}`} className="group/title">
          <h3
            className={cn(
              "font-medium tracking-tight text-foreground group-hover/title:text-primary transition-colors duration-300",
              isFeatured ? "text-xl" : "text-lg",
            )}
          >
            {post.title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-base line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center text-sm text-muted-foreground pt-1">
          <span className="font-medium text-foreground">{post.author.name}</span>
          <span className="mx-2.5 text-muted-foreground/30">·</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.readingTime && (
            <>
              <span className="mx-2.5 text-muted-foreground/30">·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

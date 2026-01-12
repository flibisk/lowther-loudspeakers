import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import postsData from "@/lib/data/posts.json";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return postsData.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = postsData.find((p) => p.slug === slug);
  
  if (!post) {
    return {};
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    image: post.image,
    url: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = postsData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const structuredData = generateStructuredData("Article", {
    title: post.title,
    description: post.excerpt,
    image: post.image,
    author: post.author,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    url: `/blog/${post.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="min-h-screen">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground">Blog</Link>
              <span>/</span>
              <span>{post.title}</span>
            </div>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-8">
              <span>By {post.author}</span>
              <span>•</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* This would typically render MDX content */}
              {/* For now, we'll show a placeholder */}
              <div className="bg-neutral-50 rounded-lg p-8 text-center">
                <h3 className="font-display text-xl font-semibold mb-4">Article Content</h3>
                <p className="text-muted-foreground mb-4">
                  This would contain the full MDX content for "{post.title}".
                </p>
                <p className="text-sm text-muted-foreground">
                  The content would be loaded from {post.content}
                </p>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {postsData
                .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
                .slice(0, 3)
                .map((relatedPost) => (
                  <div key={relatedPost.id} className="group">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div>
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors mb-2">
                          {relatedPost.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">{relatedPost.excerpt}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{relatedPost.author}</span>
                        <span>•</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Back to Blog */}
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}

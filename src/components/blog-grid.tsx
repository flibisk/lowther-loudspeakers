"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BeehiivPost {
  id: string;
  title: string;
  preview_text: string;
  thumbnail_url: string | null;
  published_at: string | number;
  web_url: string;
}

interface BlogGridProps {
  posts: BeehiivPost[];
}

const POSTS_PER_PAGE = 6;

export function BlogGrid({ posts }: BlogGridProps) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + POSTS_PER_PAGE);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground">
          Posts will appear here soon.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Check back later for insights and stories from Lowther.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePosts.map((post) => (
          <a 
            key={post.id} 
            href={post.web_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="overflow-hidden group h-full hover:shadow-lg transition-shadow duration-300 !p-0 !gap-0">
              {/* Post Thumbnail */}
              {post.thumbnail_url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.thumbnail_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              
              {/* Post Content */}
              <CardHeader className="pt-6 pb-6">
                <h3 className="font-display text-lg font-semibold group-hover:text-[#c59862] transition-colors mb-2">
                  {post.title}
                </h3>
                {post.preview_text && (
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {post.preview_text}
                  </p>
                )}
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button 
            onClick={loadMore}
            variant="black"
            size="lowther"
            className="min-w-[200px]"
          >
            Load More Posts
          </Button>
        </div>
      )}

      {/* Posts Count Info */}
      {posts.length > POSTS_PER_PAGE && (
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {visibleCount} of {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      )}
    </>
  );
}


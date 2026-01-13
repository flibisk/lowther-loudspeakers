'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ChevronRight, Heart } from 'lucide-react';

interface Album {
  id: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string | null;
  votesCount: number;
}

interface FirstComment {
  content: string;
  user: {
    displayName: string;
  };
}

export function HomepageAlbumOfWeek() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [firstComment, setFirstComment] = useState<FirstComment | null>(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch('/api/trust-your-ears/featured');
        if (response.ok) {
          const data = await response.json();
          setAlbum(data.album);
          setDaysRemaining(data.daysRemaining ?? null);
          
          if (data.album?.id) {
            const commentsResponse = await fetch(`/api/trust-your-ears/comments?albumId=${data.album.id}&sort=newest`);
            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              const comments = commentsData.comments || [];
              setCommentsCount(comments.length);
              if (comments.length > 0) {
                setFirstComment(comments[comments.length - 1]);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch featured album:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // Don't render if no album
  if (loading || !album) {
    return null;
  }

  const coverUrl = album.coverUrl || '/images/album-placeholder.svg';

  return (
    <section className="bg-neutral-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <span className="font-sarabun text-sm uppercase tracking-widest text-neutral-500">
            Lowther Listening Circle
          </span>
          <h2 className="mt-2 font-hvmuse text-3xl text-neutral-900 sm:text-4xl">
            Album of the Week
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-sarabun text-neutral-600">
            Join our community discussing albums that truly shine on Lowther speakers
          </p>
        </div>

        {/* Album Card */}
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
            <div className="flex flex-col sm:flex-row">
              {/* Album Cover */}
              <div className="relative aspect-square w-full shrink-0 bg-neutral-100 sm:w-56">
                <Image
                  src={coverUrl}
                  alt={`${album.title} by ${album.artist}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 224px"
                  unoptimized={coverUrl.includes('coverartarchive') || coverUrl.startsWith('http')}
                />
              </div>

              {/* Album Info */}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                {/* Days remaining badge */}
                {daysRemaining !== null && daysRemaining > 0 && (
                  <span className="mb-3 inline-block self-start rounded-full bg-neutral-100 px-3 py-1 font-sarabun text-xs font-medium text-neutral-600">
                    {daysRemaining} day{daysRemaining === 1 ? '' : 's'} left this week
                  </span>
                )}

                <h3 className="font-hvmuse text-2xl text-neutral-900">
                  {album.title}
                </h3>
                <p className="mt-1 font-sarabun text-lg text-neutral-600">
                  {album.artist}
                  {album.year && <span className="text-neutral-400"> · {album.year}</span>}
                </p>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <Heart className="h-4 w-4" />
                    <span className="font-sarabun text-sm">{album.votesCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-sarabun text-sm">{commentsCount}</span>
                  </div>
                </div>

                {/* First comment preview */}
                {firstComment && (
                  <div className="mt-4 rounded-lg bg-neutral-50 p-3">
                    <p className="font-sarabun text-sm leading-relaxed text-neutral-600 line-clamp-2">
                      &ldquo;{firstComment.content}&rdquo;
                    </p>
                    <p className="mt-1 font-sarabun text-xs text-neutral-400">
                      — {firstComment.user.displayName}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href="/trust-your-ears"
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 font-sarabun font-medium text-white transition-all hover:bg-neutral-800"
                >
                  Join the Discussion
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <p className="mt-6 text-center font-sarabun text-sm text-neutral-400">
            Every Sunday, the album with the most votes becomes the week&apos;s discussion
          </p>
        </div>
      </div>
    </section>
  );
}

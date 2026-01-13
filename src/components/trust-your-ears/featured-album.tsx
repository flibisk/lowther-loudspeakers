'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MessageCircle, ChevronRight } from 'lucide-react';

interface Album {
  id: string;
  musicBrainzReleaseGroupId: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string | null;
  votesCount: number;
}

interface FirstComment {
  id: string;
  content: string;
  user: {
    displayName: string;
  };
}

export function FeaturedAlbum() {
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
          
          // Fetch first comment for this album
          if (data.album?.id) {
            const commentsResponse = await fetch(`/api/trust-your-ears/comments?albumId=${data.album.id}&sort=newest`);
            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              const comments = commentsData.comments || [];
              setCommentsCount(comments.length);
              // Get the oldest comment (first recommendation)
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

  if (loading) {
    return (
      <div className="relative w-full bg-neutral-900 pt-28">
        <div className="flex h-[360px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 pt-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        
        <div className="relative flex h-[360px] items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <svg className="h-12 w-12 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h2 className="mb-2 font-hvmuse text-2xl text-white/90">No Current Listen</h2>
            <p className="font-sarabun text-white/60">
              Be the first to recommend an album
            </p>
          </div>
        </div>
      </div>
    );
  }

  const coverUrl = album.coverUrl || '/images/album-placeholder.svg';

  return (
    <div className="relative w-full">
      {/* Full-width banner with blurred album art */}
      <div className="relative w-full overflow-hidden bg-neutral-800 pt-28">
        {/* Blurred background image */}
        <div className="absolute inset-0 scale-125">
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover blur-3xl brightness-75 saturate-100"
            sizes="100vw"
            priority
            unoptimized={coverUrl.includes('coverartarchive') || coverUrl.startsWith('http')}
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        
        {/* Spacer for banner height */}
        <div className="h-[260px] sm:h-[320px] lg:h-[360px]" />
      </div>

      {/* Album card - overlaps the banner */}
      <div className="relative z-10 mx-auto -mt-44 max-w-3xl px-4 sm:-mt-48 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 sm:p-8">
          {/* Album header */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
            {/* Album cover */}
            <div className="relative -mt-20 aspect-square w-40 shrink-0 overflow-hidden rounded-xl bg-neutral-100 shadow-xl ring-1 ring-black/10 sm:-mt-24 sm:w-48">
              <Image
                src={coverUrl}
                alt={`${album.title} by ${album.artist}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 160px, 192px"
                priority
                unoptimized={coverUrl.includes('coverartarchive') || coverUrl.startsWith('http')}
              />
            </div>

            {/* Album info */}
            <div className="mt-4 flex flex-1 flex-col text-center sm:mt-0 sm:text-left">
              {/* Days remaining badge - aligned with text on desktop */}
              {daysRemaining !== null && daysRemaining > 0 && (
                <span className="mb-2 inline-block self-center rounded-full bg-neutral-100 px-3 py-1 font-sarabun text-xs font-medium text-neutral-600 sm:self-start">
                  {daysRemaining} day{daysRemaining === 1 ? '' : 's'} left this week
                </span>
              )}
              
              <h2 className="font-hvmuse text-2xl text-neutral-900 sm:text-3xl">
                {album.title}
              </h2>
              <p className="mt-1 font-sarabun text-lg text-neutral-600">
                {album.artist}
                {album.year && <span className="text-neutral-400"> · {album.year}</span>}
              </p>
              
              {/* Stats row */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <div className="flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1.5">
                  <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-sarabun text-sm text-neutral-600">
                    {album.votesCount} {album.votesCount === 1 ? 'recommendation' : 'recommendations'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1.5">
                  <MessageCircle className="h-4 w-4 text-neutral-500" />
                  <span className="font-sarabun text-sm text-neutral-600">
                    {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* First comment preview */}
          {firstComment && (
            <div className="mt-6 rounded-xl bg-neutral-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-sarabun text-sm font-medium text-neutral-700">
                  {firstComment.user.displayName}
                </span>
                <span className="font-sarabun text-xs text-neutral-400">recommended this album</span>
              </div>
              <p className="font-sarabun text-sm leading-relaxed text-neutral-600 line-clamp-3">
                &ldquo;{firstComment.content}&rdquo;
              </p>
            </div>
          )}

          {/* Join Discussion button */}
          <Link
            href={`/trust-your-ears/album/${album.id}`}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 font-sarabun font-medium text-white transition-all hover:bg-neutral-800"
          >
            <MessageCircle className="h-5 w-5" />
            Join Discussion
            <ChevronRight className="h-4 w-4" />
          </Link>
          
          {/* Weekly rotation info */}
          <p className="mt-4 text-center font-sarabun text-xs text-neutral-400">
            Every Sunday, the album with the most votes becomes the week&apos;s discussion
          </p>
        </div>
      </div>
    </div>
  );
}

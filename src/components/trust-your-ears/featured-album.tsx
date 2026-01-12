'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Album {
  id: string;
  musicBrainzReleaseGroupId: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string | null;
  votesCount: number;
}

export function FeaturedAlbum() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch('/api/trust-your-ears/featured');
        if (response.ok) {
          const data = await response.json();
          setAlbum(data.album);
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
      <div className="relative h-[420px] w-full bg-neutral-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="relative h-[420px] w-full overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
        {/* Abstract pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        
        <div className="relative flex h-full items-center justify-center px-4">
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
      <div className="relative h-[420px] w-full overflow-hidden bg-neutral-900">
        {/* Blurred background image */}
        <div className="absolute inset-0 scale-110">
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover blur-2xl brightness-50 saturate-50"
            sizes="100vw"
            priority
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        
        {/* "Current Listen" label */}
        <div className="absolute left-0 right-0 top-8 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 font-sarabun text-xs uppercase tracking-widest text-white/80 backdrop-blur-sm">
            Current Listen
          </span>
        </div>
      </div>

      {/* Album card - overlaps the banner */}
      <div className="relative z-10 mx-auto -mt-48 max-w-2xl px-4">
        <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
          {/* Album cover */}
          <div className="relative -mt-24 aspect-square w-48 shrink-0 overflow-hidden rounded-xl bg-neutral-100 shadow-xl ring-1 ring-black/10 sm:-mt-28 sm:w-56">
            <Image
              src={coverUrl}
              alt={`${album.title} by ${album.artist}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 192px, 224px"
              priority
            />
          </div>

          {/* Album info */}
          <div className="mt-6 flex flex-1 flex-col text-center sm:mt-0 sm:text-left">
            <h2 className="font-hvmuse text-2xl text-neutral-900 sm:text-3xl">
              {album.title}
            </h2>
            <p className="mt-1 font-sarabun text-lg text-neutral-600">
              {album.artist}
            </p>
            {album.year && (
              <p className="mt-1 font-sarabun text-sm text-neutral-400">
                {album.year}
              </p>
            )}
            
            {/* Vote count */}
            <div className="mt-6 flex items-center justify-center gap-2 sm:justify-start">
              <div className="flex h-10 items-center gap-2 rounded-full bg-neutral-100 px-4">
                <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-sarabun text-sm font-medium text-neutral-700">
                  {album.votesCount} {album.votesCount === 1 ? 'recommendation' : 'recommendations'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MessageCircle, ChevronRight } from 'lucide-react';

interface PreviousAlbum {
  id: string;
  musicBrainzReleaseGroupId: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string | null;
  votesCount: number;
  featuredAt: string;
  commentsCount: number;
}

interface PreviousAlbumsProps {
  onViewAlbum?: (albumId: string) => void;
}

export function PreviousAlbums({ onViewAlbum }: PreviousAlbumsProps) {
  const [albums, setAlbums] = useState<PreviousAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrevious() {
      try {
        const response = await fetch('/api/trust-your-ears/previous');
        if (response.ok) {
          const data = await response.json();
          setAlbums(data.albums || []);
        }
      } catch (error) {
        console.error('Failed to fetch previous albums:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrevious();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-600" />
      </div>
    );
  }

  if (albums.length === 0) {
    return null; // Don't show section if no previous albums
  }

  return (
    <div className="mt-12">
      <h2 className="mb-6 font-hvmuse text-xl text-neutral-900">
        Previously Discussed
      </h2>
      
      <div className="space-y-3">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => onViewAlbum?.(album.id)}
            className="group flex w-full items-center gap-4 rounded-xl bg-white p-3 text-left shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-black/10"
          >
            {/* Album cover */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-black/5">
              {album.coverUrl ? (
                <Image
                  src={album.coverUrl}
                  alt={`${album.title} by ${album.artist}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                  <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              )}
            </div>

            {/* Album info */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-hvmuse text-base text-neutral-900">
                {album.title}
              </h3>
              <p className="truncate font-sarabun text-sm text-neutral-500">
                {album.artist}
                {album.year && <span> · {album.year}</span>}
              </p>
            </div>

            {/* Meta info */}
            <div className="flex shrink-0 items-center gap-4 text-neutral-400">
              {/* Comments count */}
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="font-sarabun text-sm">{album.commentsCount}</span>
              </div>
              
              {/* Featured date */}
              <span className="hidden font-sarabun text-xs sm:block">
                {formatDate(album.featuredAt)}
              </span>
              
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

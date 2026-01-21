'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
}

interface RecommendationsSectionProps {
  userId: string;
}

export function RecommendationsSection({ userId }: RecommendationsSectionProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/account/recommendations');
      if (response.ok) {
        const data = await response.json();
        setAlbums(data.albums || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedAlbums = showAll ? albums : albums.slice(0, 4);
  const hasMore = albums.length > 4;

  return (
    <div className="mb-6">
      <h3 className="font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-3">
        Trust Your Ears Recommendations
      </h3>
      <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-sarabun text-sm text-neutral-500 mb-6">
              You haven&apos;t recommended any albums yet
            </p>
            <Link href="/trust-your-ears">
              <Button variant="black" size="lowther">
                <Plus className="h-4 w-4" />
                Recommend
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Album Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {displayedAlbums.map((album) => (
                <Link
                  key={album.id}
                  href={`/trust-your-ears/album/${album.id}`}
                  className="group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 mb-2 ring-1 ring-black/5">
                    {album.coverUrl ? (
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-neutral-200">
                        <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="font-hvmuse text-sm text-neutral-900 truncate group-hover:text-[#c59862] transition-colors">
                    {album.title}
                  </h4>
                  <p className="font-sarabun text-xs text-neutral-500 truncate">
                    {album.artist}
                  </p>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-neutral-100">
              {hasMore && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-1 font-sarabun text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {showAll ? 'Show Less' : 'Show More'}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                </button>
              )}
              <Link href="/trust-your-ears">
                <Button variant="black" size="lowther">
                  <Plus className="h-4 w-4" />
                  Recommend
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { VoteButton } from './vote-button';

interface Album {
  id: string;
  spotifyAlbumId: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string;
  votesCount: number;
}

export function AlbumList() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trust-your-ears/albums');
      
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }

      const data = await response.json();
      setAlbums(data.albums || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSuccess = () => {
    // Refresh albums list after voting
    fetchAlbums();
    // Refresh the page to update featured album
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="font-sarabun text-neutral-600">Loading albums...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="font-sarabun text-red-600">{error}</p>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-sarabun text-neutral-600">
          No albums have been recommended yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {albums.map((album) => (
        <Card key={album.id} className="border-neutral-200">
          <CardContent className="p-0">
            {/* Album Cover */}
            <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-neutral-100">
              {album.coverUrl && (
                <Image
                  src={album.coverUrl}
                  alt={`${album.title} by ${album.artist}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              )}
            </div>

            {/* Album Info */}
            <div className="p-4">
              <h3 className="font-hvmuse mb-1 line-clamp-2 text-lg font-normal text-neutral-900">
                {album.title}
              </h3>
              <p className="font-sarabun mb-2 line-clamp-1 text-sm text-neutral-700">
                {album.artist}
              </p>
              {album.year && (
                <p className="font-sarabun mb-3 text-xs text-neutral-500">
                  {album.year}
                </p>
              )}
              
              <div className="mt-4 flex items-center justify-between">
                <p className="font-sarabun text-xs text-neutral-600">
                  <span className="font-semibold">{album.votesCount}</span>{' '}
                  {album.votesCount === 1 ? 'vote' : 'votes'}
                </p>
                <VoteButton
                  spotifyAlbumId={album.spotifyAlbumId}
                  onSuccess={handleVoteSuccess}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

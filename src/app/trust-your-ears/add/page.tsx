'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface MusicBrainzAlbum {
  musicBrainzReleaseGroupId: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string | null;
}

export default function AddAlbumPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [albums, setAlbums] = useState<MusicBrainzAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get or create cookie ID for voting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let cookieId = localStorage.getItem('trust-your-ears-voter-id');
      if (!cookieId) {
        cookieId = `client-${Date.now()}-${Math.random()}`;
        localStorage.setItem('trust-your-ears-voter-id', cookieId);
      }
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setAlbums([]);

    try {
      const response = await fetch(`/api/musicbrainz/search-albums?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search albums');
      }

      const data = await response.json();
      setAlbums(data.albums || []);
      
      if (data.albums.length === 0) {
        setError('No albums found. Try a different search term.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search albums');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAlbum = async (album: MusicBrainzAlbum) => {
    setSubmitting(album.musicBrainzReleaseGroupId);
    setError(null);
    setSuccess(null);

    try {
      const cookieId = localStorage.getItem('trust-your-ears-voter-id');
      
      const response = await fetch('/api/trust-your-ears/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          musicBrainzReleaseGroupId: album.musicBrainzReleaseGroupId,
          cookieId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setSuccess('You have already voted for this album!');
        } else {
          setError(data.error || 'Failed to add album');
        }
        setSubmitting(null);
        return;
      }

      setSuccess(data.message || 'Album added successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/trust-your-ears');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add album');
      setSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/trust-your-ears"
            className="font-sarabun mb-4 inline-block text-sm text-neutral-600 hover:text-neutral-900"
          >
            ← Back to Trust Your Ears
          </Link>
          <h1 className="font-hvmuse text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
            Recommend an Album
          </h1>
          <p className="font-sarabun mt-2 text-neutral-600">
            Search for an album to recommend. If it already exists, your selection will count as a vote.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for an album..."
              className="flex-1 rounded-md border border-neutral-300 px-4 py-2 font-sarabun text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
            <Button
              type="submit"
              variant="white"
              size="default"
              disabled={loading || !query.trim()}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="size-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
            <p className="font-sarabun text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4">
            <p className="font-sarabun text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Search Results */}
        {albums.length > 0 && (
          <div>
            <h2 className="font-hvmuse mb-4 text-xl font-normal text-neutral-900">
              Search Results
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => (
                <Card
                  key={album.musicBrainzReleaseGroupId}
                  className="border-neutral-200 cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => handleSelectAlbum(album)}
                >
                  <CardContent className="p-0">
                    {/* Album Cover */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-neutral-100">
                      {album.coverUrl ? (
                        <Image
                          src={album.coverUrl}
                          alt={`${album.title} by ${album.artist}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-400">
                          <span className="font-sarabun text-sm">No Cover</span>
                        </div>
                      )}
                    </div>

                    {/* Album Info */}
                    <div className="p-4">
                      <h3 className="font-hvmuse mb-1 line-clamp-2 text-base font-normal text-neutral-900">
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
                      
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={submitting === album.musicBrainzReleaseGroupId}
                        className="w-full font-sarabun text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAlbum(album);
                        }}
                      >
                        {submitting === album.musicBrainzReleaseGroupId ? (
                          <>
                            <Loader2 className="mr-2 size-3 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Select Album'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && albums.length === 0 && query && !error && (
          <div className="py-12 text-center">
            <p className="font-sarabun text-neutral-600">
              Start by searching for an album above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

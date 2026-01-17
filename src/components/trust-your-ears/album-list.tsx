'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronUp } from 'lucide-react';

interface Album {
  id: string;
  musicBrainzReleaseGroupId: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string | null;
  votesCount: number;
}

interface AlbumWithPosition extends Album {
  previousPosition?: number;
  isMovingUp?: boolean;
}

export function AlbumList() {
  const [albums, setAlbums] = useState<AlbumWithPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const previousAlbumsRef = useRef<Album[]>([]);

  const fetchAlbums = useCallback(async (skipAnimation = false) => {
    try {
      // Add cache-busting to ensure we get fresh data after voting
      const response = await fetch('/api/trust-your-ears/albums', {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }

      const data = await response.json();
      const newAlbums: Album[] = data.albums || [];
      
      // Track position changes for animation
      if (!skipAnimation && previousAlbumsRef.current.length > 0) {
        const prevPositions = new Map(
          previousAlbumsRef.current.map((a, i) => [a.id, i])
        );
        
        const albumsWithAnimation: AlbumWithPosition[] = newAlbums.map((album, newIndex) => {
          const prevIndex = prevPositions.get(album.id);
          const isMovingUp = prevIndex !== undefined && prevIndex > newIndex;
          return {
            ...album,
            previousPosition: prevIndex,
            isMovingUp,
          };
        });
        
        setAlbums(albumsWithAnimation);
        
        // Clear animation flags after animation completes
        setTimeout(() => {
          setAlbums(prev => prev.map(a => ({ ...a, isMovingUp: false })));
        }, 600);
      } else {
        setAlbums(newAlbums);
      }
      
      previousAlbumsRef.current = newAlbums;
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums(true);
  }, [fetchAlbums]);

  const handleVote = async (albumId: string) => {
    if (votedIds.has(albumId)) return;
    
    setVotingId(albumId);

    try {
      // Use the simple upvote endpoint (doesn't require auth)
      const response = await fetch('/api/trust-your-ears/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albumId }),
      });

      if (response.status === 409) {
        // Already voted
        setVotedIds(prev => new Set(prev).add(albumId));
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      setVotedIds(prev => new Set(prev).add(albumId));
      
      // Refresh list with animation
      await fetchAlbums(false);
    } catch (err) {
      console.error('Vote error:', err);
    } finally {
      setVotingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-600" />
        <p className="mt-4 font-sarabun text-neutral-500">Loading albums...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="font-sarabun text-red-600">{error}</p>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-sarabun text-neutral-500">
          No albums have been recommended yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {albums.map((album, index) => {
        const isVoting = votingId === album.id;
        const hasVoted = votedIds.has(album.id);
        
        return (
          <div
            key={album.id}
            className={`
              group relative rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition-all duration-500
              hover:shadow-md hover:ring-black/10
              ${album.isMovingUp ? 'animate-move-up bg-green-50/50' : ''}
            `}
            style={{
              animationDelay: album.isMovingUp ? '0ms' : undefined,
            }}
          >
            {/* Desktop layout */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Rank number */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-sarabun text-lg font-semibold text-neutral-400">
                {index + 1}
              </div>

              {/* Album cover */}
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-black/5">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={`${album.title} by ${album.artist}`}
                    className="h-full w-full object-cover"
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
                <h3 className="truncate font-hvmuse text-lg text-neutral-900">
                  {album.title}
                </h3>
                <p className="truncate font-sarabun text-sm text-neutral-500">
                  {album.artist}
                  {album.year && <span className="text-neutral-400"> · {album.year}</span>}
                </p>
              </div>

              {/* Vote count & button */}
              <div className="flex shrink-0 items-center gap-3">
                <div className="text-center">
                  <p className="font-sarabun text-lg font-semibold text-neutral-700">
                    {album.votesCount}
                  </p>
                  <p className="font-sarabun text-[10px] uppercase tracking-wider text-neutral-400">
                    {album.votesCount === 1 ? 'vote' : 'votes'}
                  </p>
                </div>
                <button
                  onClick={() => handleVote(album.id)}
                  disabled={isVoting || hasVoted}
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200
                    ${hasVoted 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 active:scale-95'
                    }
                    disabled:cursor-not-allowed
                  `}
                  aria-label={hasVoted ? 'Already voted' : `Vote for ${album.title}`}
                >
                  {isVoting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
                  ) : (
                    <ChevronUp 
                      className={`h-6 w-6 transition-transform ${hasVoted ? '' : 'group-hover:scale-110'}`} 
                      strokeWidth={hasVoted ? 2.5 : 2}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile layout - stacked for better readability */}
            <div className="flex sm:hidden gap-3">
              {/* Rank number */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-sarabun text-base font-semibold text-neutral-400">
                {index + 1}
              </div>

              {/* Album cover */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-black/5">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={`${album.title} by ${album.artist}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                    <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Album info + vote */}
              <div className="min-w-0 flex-1">
                <h3 className="font-hvmuse text-base text-neutral-900 leading-snug">
                  {album.title}
                </h3>
                <p className="font-sarabun text-sm text-neutral-500 mt-0.5">
                  {album.artist}
                  {album.year && <span className="text-neutral-400"> · {album.year}</span>}
                </p>
                
                {/* Vote row */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleVote(album.id)}
                    disabled={isVoting || hasVoted}
                    className={`
                      flex h-8 items-center gap-1.5 px-3 rounded-lg transition-all duration-200
                      ${hasVoted 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 active:scale-95'
                      }
                      disabled:cursor-not-allowed
                    `}
                    aria-label={hasVoted ? 'Already voted' : `Vote for ${album.title}`}
                  >
                    {isVoting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
                    ) : (
                      <ChevronUp 
                        className="h-4 w-4" 
                        strokeWidth={hasVoted ? 2.5 : 2}
                      />
                    )}
                    <span className="font-sarabun text-sm font-medium">
                      {album.votesCount} {album.votesCount === 1 ? 'vote' : 'votes'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

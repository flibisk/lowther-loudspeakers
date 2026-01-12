'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Search, Loader2, Check } from 'lucide-react';
import Image from 'next/image';

interface SearchResult {
  musicBrainzReleaseGroupId: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string;
}

interface AlbumSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AlbumSearchModal({ isOpen, onClose, onSuccess }: AlbumSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/musicbrainz/search-albums?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.albums || []);
        } else {
          setError('Failed to search albums');
        }
      } catch (err) {
        setError('Failed to search albums');
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = async (album: SearchResult) => {
    setSubmitting(album.musicBrainzReleaseGroupId);
    setError(null);

    try {
      const response = await fetch('/api/trust-your-ears/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          musicBrainzReleaseGroupId: album.musicBrainzReleaseGroupId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('You have already voted for this album');
        } else {
          setError(data.error || 'Failed to add album');
        }
        return;
      }

      setSubmitted(album.musicBrainzReleaseGroupId);
      
      // Close modal after brief delay
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1000);
    } catch (err) {
      setError('Failed to add album');
    } finally {
      setSubmitting(null);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setQuery('');
      setResults([]);
      setSubmitted(null);
      setError(null);
    }, 300);
  }, [onClose]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20 sm:pt-24">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-slide-up">
        <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 p-4">
            <h2 className="font-hvmuse text-lg text-neutral-900">
              Recommend an Album
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search input */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by artist or album..."
                autoFocus
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-12 pr-4 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
              {loading && (
                <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-neutral-400" />
              )}
            </div>
            
            {error && (
              <p className="mt-2 font-sarabun text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto border-t border-neutral-100">
            {results.length === 0 && query.length >= 2 && !loading && (
              <div className="p-8 text-center">
                <p className="font-sarabun text-neutral-500">
                  No albums found for &ldquo;{query}&rdquo;
                </p>
              </div>
            )}

            {results.length === 0 && query.length < 2 && (
              <div className="p-8 text-center">
                <p className="font-sarabun text-neutral-500">
                  Type an artist or album name to search
                </p>
              </div>
            )}

            {results.map((album) => {
              const isSubmitting = submitting === album.musicBrainzReleaseGroupId;
              const isSubmitted = submitted === album.musicBrainzReleaseGroupId;

              return (
                <button
                  key={album.musicBrainzReleaseGroupId}
                  onClick={() => handleSelect(album)}
                  disabled={isSubmitting || isSubmitted}
                  className="flex w-full items-center gap-4 border-b border-neutral-50 p-4 text-left transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 last:border-b-0"
                >
                  {/* Album cover */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={album.coverUrl}
                      alt={album.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>

                  {/* Album info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-hvmuse text-base text-neutral-900">
                      {album.title}
                    </p>
                    <p className="truncate font-sarabun text-sm text-neutral-500">
                      {album.artist}
                      {album.year && <span> · {album.year}</span>}
                    </p>
                  </div>

                  {/* Action indicator */}
                  <div className="shrink-0">
                    {isSubmitting && (
                      <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                    )}
                    {isSubmitted && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-100 p-4">
            <p className="text-center font-sarabun text-xs text-neutral-400">
              Albums with the most votes become the next discussion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

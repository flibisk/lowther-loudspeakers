'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Search, Loader2, Check, Mail, ArrowLeft, Send } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from './auth-modal';

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
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Two-step flow: select album, then add comment
  const [selectedAlbum, setSelectedAlbum] = useState<SearchResult | null>(null);
  const [comment, setComment] = useState('');

  // Debounced search - only search when user pauses typing
  useEffect(() => {
    if (!user || !query.trim() || query.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Clear old results and show loading immediately
    setResults([]);
    setLoading(true);
    setError(null);
    
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/musicbrainz/search-albums?q=${encodeURIComponent(query.trim())}`);
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
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [query, user]);

  const handleSelectAlbum = (album: SearchResult) => {
    setSelectedAlbum(album);
    setError(null);
  };

  const handleBackToSearch = () => {
    setSelectedAlbum(null);
    setComment('');
    setError(null);
  };

  const handleSubmit = async () => {
    if (!user || !selectedAlbum) return;

    if (!comment.trim() || comment.trim().length < 20) {
      setError('Please share why you\'re recommending this album (at least 20 characters)');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/trust-your-ears/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          musicBrainzReleaseGroupId: selectedAlbum.musicBrainzReleaseGroupId,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('You have already recommended this album');
        } else {
          setError(data.error || 'Failed to add album');
        }
        return;
      }

      setSubmitted(true);
      
      // Close modal after brief delay
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1500);
    } catch (err) {
      setError('Failed to add album');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setQuery('');
      setResults([]);
      setSelectedAlbum(null);
      setComment('');
      setSubmitted(false);
      setError(null);
    }, 300);
  }, [onClose]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showAuthModal) {
        if (selectedAlbum) {
          handleBackToSearch();
        } else {
          handleClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleClose, showAuthModal, selectedAlbum]);

  if (!isOpen) return null;

  // Show sign-in prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20 sm:pt-24">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleClose}
          />
          <div className="relative w-full max-w-md animate-slide-up">
            <div className="rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 sm:p-8">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                  <Mail className="h-6 w-6 text-neutral-600" />
                </div>
                <h2 className="font-hvmuse text-xl text-neutral-900">
                  Sign in to Recommend
                </h2>
                <p className="mt-2 font-sarabun text-sm text-neutral-500">
                  Sign in with your email to recommend albums for the community to discuss.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-6 w-full rounded-xl bg-neutral-900 px-4 py-3 font-sarabun font-medium text-white transition-all hover:bg-neutral-800"
                >
                  Continue with Email
                </button>
                <p className="mt-4 font-sarabun text-xs text-neutral-400">
                  Your email won&apos;t be displayed publicly
                </p>
              </div>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  // Step 2: Add comment for selected album
  if (selectedAlbum) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20 sm:pt-24">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={handleClose}
        />
        <div className="relative w-full max-w-lg animate-slide-up">
          <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-neutral-100 p-4">
              <button
                onClick={handleBackToSearch}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="font-hvmuse text-lg text-neutral-900">
                Why this album?
              </h2>
            </div>

            {/* Selected Album */}
            <div className="border-b border-neutral-100 p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={selectedAlbum.coverUrl || '/images/album-placeholder.svg'}
                    alt={selectedAlbum.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized={selectedAlbum.coverUrl?.startsWith('http')}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-hvmuse text-lg text-neutral-900">
                    {selectedAlbum.title}
                  </p>
                  <p className="font-sarabun text-sm text-neutral-500">
                    {selectedAlbum.artist}
                    {selectedAlbum.year && <span> · {selectedAlbum.year}</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Comment Form */}
            <div className="p-4">
              <p className="mb-3 font-sarabun text-sm text-neutral-600">
                Share why this album sounds great on Lowther speakers. What makes the production special?
              </p>
              
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. The dynamic range is exceptional, with natural acoustic instrument separation..."
                rows={4}
                maxLength={1000}
                autoFocus
                className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
              
              <div className="mt-2 flex items-center justify-between">
                <span className="font-sarabun text-xs text-neutral-400">
                  {comment.length < 20 
                    ? `${20 - comment.length} more characters needed`
                    : `${comment.length}/1000`
                  }
                </span>
              </div>

              {error && (
                <p className="mt-2 font-sarabun text-sm text-red-600">{error}</p>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={submitting || submitted || comment.trim().length < 20}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 font-sarabun font-medium text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : submitted ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added!
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Recommend Album
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Search for album
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20 sm:pt-24">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={handleClose}
        />
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search artist or album..."
                  autoFocus
                  style={{ lineHeight: '1.5' }}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 h-12 px-12 font-sarabun text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
                {loading && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-neutral-400" />
                )}
              </div>
              
              {error && (
                <p className="mt-2 font-sarabun text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto border-t border-neutral-100">
              {results.length === 0 && query.length >= 3 && !loading && (
                <div className="p-8 text-center">
                  <p className="font-sarabun text-neutral-500">
                    No albums found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              )}

              {results.length === 0 && query.length < 3 && !loading && (
                <div className="p-8 text-center">
                  <p className="font-sarabun text-neutral-500">
                    {query.length === 0 
                      ? 'Type an artist or album name to search'
                      : `Type ${3 - query.length} more character${3 - query.length === 1 ? '' : 's'}...`
                    }
                  </p>
                </div>
              )}

              {loading && results.length === 0 && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                </div>
              )}

              {results.map((album) => (
                <button
                  key={album.musicBrainzReleaseGroupId}
                  onClick={() => handleSelectAlbum(album)}
                  className="flex w-full items-center gap-4 border-b border-neutral-50 p-4 text-left transition-colors hover:bg-neutral-50 last:border-b-0"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={album.coverUrl || '/images/album-placeholder.svg'}
                      alt={album.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                      unoptimized={album.coverUrl?.startsWith('http')}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-hvmuse text-base text-neutral-900">
                      {album.title}
                    </p>
                    <p className="truncate font-sarabun text-sm text-neutral-500">
                      {album.artist}
                      {album.year && <span> · {album.year}</span>}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-100 p-4">
              <p className="text-center font-sarabun text-xs text-neutral-400">
                You&apos;ll be asked to explain why you&apos;re recommending this album
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

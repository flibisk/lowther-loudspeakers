'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Calendar, Heart } from 'lucide-react';
import { CommentsSection } from '@/components/trust-your-ears/comments-section';

interface Album {
  id: string;
  musicBrainzReleaseGroupId: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string | null;
  votesCount: number;
  featuredAt: string | null;
  commentsCount: number;
}

export default function AlbumDiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const response = await fetch(`/api/trust-your-ears/album/${albumId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Album not found');
          } else {
            setError('Failed to load album');
          }
          return;
        }
        const data = await response.json();
        setAlbum(data.album);
      } catch (err) {
        console.error('Failed to fetch album:', err);
        setError('Failed to load album');
      } finally {
        setLoading(false);
      }
    }
    
    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-600" />
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-24">
          <Link 
            href="/trust-your-ears"
            className="mb-8 inline-flex items-center gap-2 font-sarabun text-sm text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trust Your Ears
          </Link>
          
          <div className="text-center">
            <h1 className="font-hvmuse text-2xl text-neutral-900">{error || 'Album not found'}</h1>
            <p className="mt-2 font-sarabun text-neutral-500">
              This album may have been removed or the link is incorrect.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const coverUrl = album.coverUrl || '/images/album-placeholder.svg';
  const isExternal = coverUrl.includes('coverartarchive') || coverUrl.startsWith('http');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <Link 
            href="/trust-your-ears"
            className="inline-flex items-center gap-2 font-sarabun text-sm text-neutral-600 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trust Your Ears
          </Link>
        </div>
      </div>

      {/* Album Header */}
      <div className="relative overflow-hidden bg-neutral-800 pt-8 pb-32">
        {/* Blurred background */}
        <div className="absolute inset-0 scale-125">
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover blur-3xl brightness-50 saturate-75"
            sizes="100vw"
            unoptimized={isExternal}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        
        {/* Album Info */}
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-8">
            {/* Cover Art */}
            <div className="relative aspect-square w-48 shrink-0 overflow-hidden rounded-xl bg-neutral-700 shadow-2xl ring-1 ring-white/10 sm:w-56">
              <Image
                src={coverUrl}
                alt={`${album.title} by ${album.artist}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 192px, 224px"
                priority
                unoptimized={isExternal}
              />
            </div>
            
            {/* Album Details */}
            <div className="flex-1 text-center sm:pb-4 sm:text-left">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-sarabun text-xs text-white/70 backdrop-blur-sm">
                <Calendar className="h-3 w-3" />
                Discussed {album.featuredAt ? formatDate(album.featuredAt) : 'Unknown'}
              </p>
              
              <h1 className="font-hvmuse text-3xl text-white sm:text-4xl">
                {album.title}
              </h1>
              <p className="mt-2 font-sarabun text-lg text-white/80">
                {album.artist}
                {album.year && <span className="text-white/60"> · {album.year}</span>}
              </p>
              
              {/* Stats */}
              <div className="mt-4 flex items-center justify-center gap-6 sm:justify-start">
                <div className="flex items-center gap-2 text-white/60">
                  <Heart className="h-4 w-4" />
                  <span className="font-sarabun text-sm">{album.votesCount} recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-sarabun text-sm">{album.commentsCount} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="-mt-20 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
          <h2 className="mb-6 font-hvmuse text-xl text-neutral-900">Discussion</h2>
          <CommentsSection albumId={album.id} albumTitle={album.title} />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { Plus, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlbumList } from '@/components/trust-your-ears/album-list';
import { FeaturedAlbum } from '@/components/trust-your-ears/featured-album';
import { AlbumSearchModal } from '@/components/trust-your-ears/album-search-modal';
import { PreviousAlbums } from '@/components/trust-your-ears/previous-albums';

export default function TrustYourEarsPage() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRecommendSuccess = useCallback(() => {
    // Trigger refresh of album lists
    setRefreshKey(k => k + 1);
  }, []);


  return (
    <div className="min-h-screen bg-neutral-50">
      {/* SEO: Visually hidden H1 for screen readers and search engines */}
      <h1 className="sr-only">Trust Your Ears - Lowther&apos;s Album of the Week Club</h1>
      
      {/* Featured Album Banner with How It Works Button */}
      <div className="relative">
        <FeaturedAlbum key={`featured-${refreshKey}`} />
        
        {/* How It Works Button - Positioned above album card */}
        <div className="absolute left-0 right-0 top-24 z-20 flex justify-center sm:top-36">
          <button
            onClick={() => setShowHowItWorks(true)}
            className="flex items-center gap-2 rounded-full bg-black/90 px-5 py-2.5 font-sarabun text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black"
          >
            <HelpCircle className="h-4 w-4" />
            How it works
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header with CTA */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="font-hvmuse text-2xl text-neutral-900">
              Up Next
            </h2>
            <p className="mt-1 font-sarabun text-sm text-neutral-500">
              Vote for albums you think we should discuss next
            </p>
          </div>
          <Button 
            variant="white" 
            size="lowther" 
            className="gap-2 shadow-sm"
            onClick={() => setShowSearchModal(true)}
          >
            <Plus className="size-4" />
            Recommend
          </Button>
        </div>

        {/* Album List (voting queue) */}
        <AlbumList key={`list-${refreshKey}`} />
        
        {/* Footer text */}
        <div className="mt-8 text-center">
          <p className="font-sarabun text-sm text-neutral-400">
            Every Sunday, the album with the most votes becomes the week&apos;s discussion
          </p>
        </div>

        {/* Previously Discussed Albums */}
        <PreviousAlbums />
      </div>

      {/* Search Modal */}
      <AlbumSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSuccess={handleRecommendSuccess}
      />

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHowItWorks(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-lg animate-fade-in rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            {/* Close button */}
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Content */}
            <div className="text-center">
              <h2 className="mb-4 font-hvmuse text-2xl text-neutral-900">
                Trust Your Ears
              </h2>
              <p className="font-sarabun text-base leading-relaxed text-neutral-600">
                Trust Your Ears is Lowther&apos;s album club. Think book club for music. Every week the community recommends and votes on a single record to listen to together. A simple way for Lowther owners to discover beautifully mastered music and hear what their speakers are truly capable of.
              </p>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="mt-6 rounded-xl bg-neutral-900 px-6 py-3 font-sarabun font-medium text-white transition-all hover:bg-neutral-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

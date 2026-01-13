'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlbumList } from '@/components/trust-your-ears/album-list';
import { FeaturedAlbum } from '@/components/trust-your-ears/featured-album';
import { AlbumSearchModal } from '@/components/trust-your-ears/album-search-modal';
import { PreviousAlbums } from '@/components/trust-your-ears/previous-albums';

export default function TrustYourEarsPage() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRecommendSuccess = useCallback(() => {
    // Trigger refresh of album lists
    setRefreshKey(k => k + 1);
  }, []);


  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Featured Album Banner - Full Width with Comments */}
      <FeaturedAlbum key={`featured-${refreshKey}`} showComments={true} />

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
    </div>
  );
}

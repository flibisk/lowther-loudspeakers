'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSpeakerImages } from '@/hooks/use-speaker-images';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { generateAltText } from '@/lib/utils/alt-text-generator';

interface SpeakerGalleryProps {
  speakerSlug: string;
  category?: 'gallery' | 'details' | 'technical';
  showThumbnails?: boolean;
  autoPlay?: boolean;
}

export function SpeakerGallery({ 
  speakerSlug, 
  category = 'gallery',
  showThumbnails = true,
  autoPlay = false
}: SpeakerGalleryProps) {
  const { images, loading, error, getImages } = useSpeakerImages(speakerSlug);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading images: {error}</div>
      </div>
    );
  }

  const imageList = getImages(category);
  
  if (imageList.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No images available</div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageList[currentIndex]}
            alt={generateAltText(speakerSlug, imageList[currentIndex], category, currentIndex)}
            fill
            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => openLightbox(currentIndex)}
          />
          
          {/* Navigation Arrows */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          
          {/* Image Counter */}
          {imageList.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {imageList.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && imageList.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {imageList.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-[#c59862] ring-2 ring-[#c59862]/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={generateAltText(speakerSlug, image, category, index)}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {/* Main Image */}
            <div className="relative aspect-[4/3] max-h-[80vh]">
              <Image
                src={imageList[currentIndex]}
                alt={generateAltText(speakerSlug, imageList[currentIndex], category, currentIndex)}
                fill
                className="object-contain"
              />
            </div>

            {/* Navigation */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image Counter */}
            {imageList.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {currentIndex + 1} / {imageList.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

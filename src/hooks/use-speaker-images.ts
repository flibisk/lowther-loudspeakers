'use client';

import { useState, useEffect } from 'react';
import { SpeakerImages } from '@/lib/utils/image-loader';

interface UseSpeakerImagesReturn {
  images: SpeakerImages | null;
  loading: boolean;
  error: string | null;
  getRandomImage: (category: keyof SpeakerImages) => string | null;
  getFirstImage: (category: keyof SpeakerImages) => string | null;
  getImages: (category: keyof SpeakerImages) => string[];
}

/**
 * React hook for loading and managing speaker images
 * @param speakerSlug - The speaker's slug
 * @returns Object with images, loading state, and helper functions
 */
export function useSpeakerImages(speakerSlug: string): UseSpeakerImagesReturn {
  const [images, setImages] = useState<SpeakerImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, you'd call an API endpoint here
        // For now, we'll simulate the loading
        const response = await fetch(`/api/speakers/${speakerSlug}/images`);
        
        if (!response.ok) {
          throw new Error(`Failed to load images for ${speakerSlug}`);
        }
        
        const imageData = await response.json();
        setImages(imageData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load images');
        setImages(null);
      } finally {
        setLoading(false);
      }
    }

    if (speakerSlug) {
      loadImages();
    }
  }, [speakerSlug]);

  const getRandomImage = (category: keyof SpeakerImages): string | null => {
    if (!images) return null;
    const categoryImages = images[category];
    if (categoryImages.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    return categoryImages[randomIndex];
  };

  const getFirstImage = (category: keyof SpeakerImages): string | null => {
    if (!images) return null;
    const categoryImages = images[category];
    return categoryImages.length > 0 ? categoryImages[0] : null;
  };

  const getImages = (category: keyof SpeakerImages): string[] => {
    if (!images) return [];
    return images[category];
  };

  return {
    images,
    loading,
    error,
    getRandomImage,
    getFirstImage,
    getImages
  };
}

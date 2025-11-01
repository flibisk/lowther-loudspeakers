import { readdir } from 'fs/promises';
import { join } from 'path';

export interface SpeakerImages {
  hero: string[];
  gallery: string[];
  details: string[];
  technical: string[];
}

/**
 * Dynamically loads all images from a speaker's image directories
 * @param speakerSlug - The speaker's slug (e.g., "quarterwave")
 * @param speakerData - Optional speaker data with image base paths
 * @returns Object with arrays of image paths for each category
 */
export async function loadSpeakerImages(
  speakerSlug: string, 
  speakerData?: any
): Promise<SpeakerImages> {
  // Use speaker data base path if available, otherwise construct default path
  let basePath: string;
  if (speakerData?.images?.base) {
    // Remove leading slash and 'public/' to get relative path from project root
    const relativePath = speakerData.images.base.replace(/^\//, '').replace(/^public\//, '');
    basePath = join(process.cwd(), 'public', relativePath);
  } else {
    basePath = join(process.cwd(), 'public', 'images', 'speakers', speakerSlug);
  }
  
  const imageCategories = ['hero', 'gallery', 'details', 'technical'] as const;
  const images: SpeakerImages = {
    hero: [],
    gallery: [],
    details: [],
    technical: []
  };

  for (const category of imageCategories) {
    try {
      // Use speaker data category path if available
      let categoryPath: string;
      if (speakerData?.images?.[category]) {
        categoryPath = join(basePath, speakerData.images[category].replace(/\/$/, ''));
      } else {
        categoryPath = join(basePath, category);
      }
      
      const files = await readdir(categoryPath);
      
      // Filter for image files and create full paths
      const imageFiles = files
        .filter(file => {
          const ext = file.toLowerCase().split('.').pop();
          return ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext || '');
        })
        .map(file => {
          // Construct path using speaker data if available
          if (speakerData?.images?.base && speakerData?.images?.[category]) {
            return `${speakerData.images.base}${speakerData.images[category]}${file}`;
          } else {
            return `/images/speakers/${speakerSlug}/${category}/${file}`;
          }
        })
        .sort(); // Sort for consistent ordering
      
      images[category] = imageFiles;
    } catch (error) {
      // Directory doesn't exist or can't be read
      console.warn(`Could not load images from ${join(basePath, category)}`);
      images[category] = [];
    }
  }

  return images;
}

/**
 * Gets a random image from a specific category
 * @param speakerSlug - The speaker's slug
 * @param category - The image category
 * @returns A random image path or null if none found
 */
export async function getRandomSpeakerImage(
  speakerSlug: string, 
  category: keyof SpeakerImages
): Promise<string | null> {
  const images = await loadSpeakerImages(speakerSlug);
  const categoryImages = images[category];
  
  if (categoryImages.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * categoryImages.length);
  return categoryImages[randomIndex];
}

/**
 * Gets the first image from a specific category (useful for hero images)
 * @param speakerSlug - The speaker's slug
 * @param category - The image category
 * @returns The first image path or null if none found
 */
export async function getFirstSpeakerImage(
  speakerSlug: string, 
  category: keyof SpeakerImages
): Promise<string | null> {
  const images = await loadSpeakerImages(speakerSlug);
  const categoryImages = images[category];
  
  return categoryImages.length > 0 ? categoryImages[0] : null;
}

/**
 * Gets all images from a specific category
 * @param speakerSlug - The speaker's slug
 * @param category - The image category
 * @returns Array of image paths
 */
export async function getSpeakerImages(
  speakerSlug: string, 
  category: keyof SpeakerImages
): Promise<string[]> {
  const images = await loadSpeakerImages(speakerSlug);
  return images[category];
}

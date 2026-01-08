/**
 * Cover Art Archive API Client
 * Used to fetch album cover artwork
 */

const COVER_ART_BASE_URL = 'https://coverartarchive.org';

/**
 * Get cover art URL for a MusicBrainz release-group ID
 * Returns null if no cover art is available
 */
export async function getCoverArtUrl(releaseGroupId: string): Promise<string | null> {
  try {
    // Try front cover first
    const frontUrl = `${COVER_ART_BASE_URL}/release-group/${releaseGroupId}/front`;
    
    const response = await fetch(frontUrl, {
      method: 'HEAD', // Just check if it exists
      headers: {
        Accept: 'image/*',
      },
    });

    if (response.ok) {
      return frontUrl;
    }

    // If front doesn't exist, try to get any available image
    const apiResponse = await fetch(
      `${COVER_ART_BASE_URL}/release-group/${releaseGroupId}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data.images && data.images.length > 0) {
        // Find front cover or use first image
        const frontImage = data.images.find((img: any) => img.front === true);
        if (frontImage) {
          return frontImage.image;
        }
        if (data.images[0]?.image) {
          return data.images[0].image;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Cover Art Archive error for ${releaseGroupId}:`, error);
    return null;
  }
}

/**
 * Get placeholder image URL for albums without cover art
 */
export function getPlaceholderImageUrl(): string {
  // Use a simple, tasteful placeholder
  // You can replace this with your own placeholder image
  return '/images/album-placeholder.svg';
}

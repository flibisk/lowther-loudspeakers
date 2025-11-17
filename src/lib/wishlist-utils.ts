/**
 * Utility functions for wishlist product URL mapping
 */

/**
 * Determines the product page URL based on product handle/id
 */
export function getProductUrl(handle: string, id?: string): string {
  // Collection products
  if (handle.includes('sinfonia') || id?.includes('sinfonia')) {
    return `/collection/sinfonia#${handle}`;
  }
  if (handle.includes('philharmonic') || id?.includes('philharmonic')) {
    return `/collection/philharmonic#${handle}`;
  }
  if (handle.includes('concert') || id?.includes('concert')) {
    return `/collection/concert#${handle}`;
  }
  if (handle.includes('grand-opera') || id?.includes('grand-opera')) {
    return `/collection/grand-opera#${handle}`;
  }
  if (handle.includes('super-tweeter') || id?.includes('super-tweeter') || handle.includes('supertweeter') || id?.includes('supertweeter')) {
    return `/collection/super-tweeter`;
  }

  // Ensemble products
  if (handle.includes('px4') || id?.includes('px4')) {
    return `/ensemble/px4-amplifier`;
  }
  if (handle.includes('cables') || id?.includes('cables') || handle.includes('reference-cables') || id?.includes('reference-cables')) {
    return `/ensemble/reference-cables`;
  }
  if (handle.includes('badges') || id?.includes('badges')) {
    return `/ensemble/lowther-badges`;
  }
  if (handle.includes('phase-plug') || id?.includes('phase-plug')) {
    return `/ensemble/phase-plugs`;
  }

  // Masterpieces (loudspeakers)
  if (handle.includes('almira') || id?.includes('almira')) {
    return `/loudspeakers/almira`;
  }
  if (handle.includes('audiovector') || id?.includes('audiovector')) {
    return `/loudspeakers/audiovector`;
  }
  if (handle.includes('voigt-horn') || id?.includes('voigt-horn')) {
    return `/loudspeakers/voigt-horn`;
  }
  if (handle.includes('quarter-wave') || id?.includes('quarter-wave') || handle.includes('acousta') || id?.includes('acousta')) {
    return `/loudspeakers/acousta-quarter-wave`;
  }

  // Default: try to find in products page
  return `/products#instruments`;
}


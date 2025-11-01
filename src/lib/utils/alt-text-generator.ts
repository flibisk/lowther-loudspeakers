import speakersDatabase from '@/lib/data/speakers-database.json';

/**
 * Generates SEO-optimized alt text for speaker images
 * @param speakerSlug - The speaker's slug
 * @param imagePath - The full image path
 * @param category - The image category (hero, gallery, details, technical)
 * @param index - Optional index for multiple images
 * @returns SEO-optimized alt text
 */
export function generateAltText(
  speakerSlug: string,
  imagePath: string,
  category: string,
  index?: number
): string {
  const speaker = speakersDatabase.speakers[speakerSlug as keyof typeof speakersDatabase.speakers];
  
  if (!speaker) {
    return `${speakerSlug} ${category} image`;
  }

  const speakerTitle = speaker.title;
  const feeling = speaker.feeling;
  
  // Extract filename without extension for more specific descriptions
  const filename = imagePath.split('/').pop()?.split('.')[0] || '';
  
  // Generate category-specific alt text
  switch (category) {
    case 'hero':
      return `${speakerTitle} loudspeaker - ${feeling} - Professional product photography showing the ${speakerTitle} in a premium setting`;
      
    case 'gallery':
      if (index !== undefined) {
        return `${speakerTitle} gallery image ${index + 1} - ${feeling} - ${getGalleryDescription(speakerTitle, filename)}`;
      }
      return `${speakerTitle} gallery - ${feeling} - Multiple views of the ${speakerTitle} loudspeaker`;
      
    case 'details':
      return `${speakerTitle} detail view - ${feeling} - Close-up photography showing craftsmanship and materials of the ${speakerTitle}`;
      
    case 'technical':
      return `${speakerTitle} technical specifications - ${feeling} - Technical diagrams and specifications for the ${speakerTitle} loudspeaker`;
      
    default:
      return `${speakerTitle} ${category} image - ${feeling} - ${speakerTitle} loudspeaker photography`;
  }
}

/**
 * Generates specific gallery descriptions based on filename patterns
 * @param speakerTitle - The speaker title
 * @param filename - The image filename
 * @returns Specific description
 */
function getGalleryDescription(speakerTitle: string, filename: string): string {
  const lowerFilename = filename.toLowerCase();
  
  // Common patterns for gallery descriptions
  if (lowerFilename.includes('room') || lowerFilename.includes('living')) {
    return `${speakerTitle} in a modern living room setting`;
  }
  if (lowerFilename.includes('corner') || lowerFilename.includes('placement')) {
    return `${speakerTitle} showing optimal room placement`;
  }
  if (lowerFilename.includes('close') || lowerFilename.includes('detail')) {
    return `Close-up view of ${speakerTitle} craftsmanship`;
  }
  if (lowerFilename.includes('setup') || lowerFilename.includes('system')) {
    return `${speakerTitle} as part of a complete audio system`;
  }
  if (lowerFilename.includes('wood') || lowerFilename.includes('veneer')) {
    return `${speakerTitle} showcasing premium wood veneer finish`;
  }
  if (lowerFilename.includes('driver') || lowerFilename.includes('cone')) {
    return `${speakerTitle} driver and internal components`;
  }
  
  // Default gallery description
  return `Professional photography of the ${speakerTitle} loudspeaker`;
}

/**
 * Generates alt text for speaker cards
 * @param title - Speaker title
 * @param feeling - Speaker feeling/tagline
 * @returns Alt text for speaker card images
 */
export function generateSpeakerCardAltText(title: string, feeling: string): string {
  return `${title} loudspeaker - ${feeling} - Premium ${title} loudspeaker with elegant design and exceptional sound quality`;
}

/**
 * Generates alt text for featured masterpieces
 * @param title - Speaker title
 * @param feeling - Speaker feeling/tagline
 * @returns Alt text for featured section
 */
export function generateFeaturedAltText(title: string, feeling: string): string {
  return `Featured ${title} loudspeaker - ${feeling} - Discover the ${title}, a handcrafted loudspeaker showcasing Lowther's commitment to acoustic excellence`;
}

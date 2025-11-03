import driveUnitsDatabase from '@/lib/data/drive-units-database.json';

/**
 * Generates SEO-optimized alt text for drive unit images
 * @param collectionSlug - The collection's slug
 * @param imagePath - The full image path
 * @param category - The image category (hero, gallery, details, technical)
 * @param index - Optional index for multiple images
 * @returns SEO-optimized alt text
 */
export function generateDriveUnitAltText(
  collectionSlug: string,
  imagePath: string,
  category: string,
  index?: number
): string {
  const collection = driveUnitsDatabase.data.find((item) => item.slug === collectionSlug && item.type === 'collection');
  
  if (!collection) {
    return `${collectionSlug} ${category} image`;
  }

  const collectionTitle = collection.title;
  const feeling = (collection as any).feeling || '';
  
  // Extract filename without extension for more specific descriptions
  const filename = imagePath.split('/').pop()?.split('.')[0] || '';
  
  // Generate category-specific alt text
  switch (category) {
    case 'hero':
      return `${collectionTitle} drive unit - ${feeling} - Professional photography of Lowther ${collectionTitle} full-range drive unit showing premium craftsmanship`;
      
    case 'gallery':
      if (index !== undefined) {
        return `${collectionTitle} gallery image ${index + 1} - ${feeling} - ${getDriveUnitGalleryDescription(collectionTitle, filename)}`;
      }
      return `${collectionTitle} gallery - ${feeling} - Multiple views of Lowther ${collectionTitle} drive units`;
      
    case 'details':
      return `${collectionTitle} detail view - ${feeling} - Close-up photography showing craftsmanship and materials of Lowther ${collectionTitle} drive unit`;
      
    case 'technical':
      return `${collectionTitle} technical specifications - ${feeling} - Technical diagrams and specifications for Lowther ${collectionTitle} drive unit`;
      
    default:
      return `${collectionTitle} ${category} image - ${feeling} - Lowther ${collectionTitle} drive unit photography`;
  }
}

/**
 * Generates specific gallery descriptions based on filename patterns
 * @param collectionTitle - The collection title
 * @param filename - The image filename
 * @returns Specific description
 */
function getDriveUnitGalleryDescription(collectionTitle: string, filename: string): string {
  const lowerFilename = filename.toLowerCase();
  
  // Common patterns for drive unit gallery descriptions
  if (lowerFilename.includes('cone') || lowerFilename.includes('diaphragm')) {
    return `Lowther ${collectionTitle} showing cone and diaphragm construction`;
  }
  if (lowerFilename.includes('magnet') || lowerFilename.includes('motor')) {
    return `Lowther ${collectionTitle} magnetic motor system and frame`;
  }
  if (lowerFilename.includes('voice') || lowerFilename.includes('coil')) {
    return `Lowther ${collectionTitle} voice coil and winding details`;
  }
  if (lowerFilename.includes('frame') || lowerFilename.includes('basket')) {
    return `Lowther ${collectionTitle} frame and basket construction`;
  }
  if (lowerFilename.includes('assembly') || lowerFilename.includes('build')) {
    return `Lowther ${collectionTitle} assembly and manufacturing process`;
  }
  if (lowerFilename.includes('comparison') || lowerFilename.includes('vs')) {
    return `Lowther ${collectionTitle} comparison with other drive units`;
  }
  if (lowerFilename.includes('test') || lowerFilename.includes('measurement')) {
    return `Lowther ${collectionTitle} testing and measurement setup`;
  }
  
  // Default gallery description
  return `Professional photography of Lowther ${collectionTitle} drive unit`;
}

/**
 * Generates alt text for individual drive unit instruments
 * @param instrumentTitle - Instrument title (e.g., "PM4A Concert")
 * @param collectionTitle - Collection title (e.g., "Concert Collection")
 * @param magnetType - Magnet type (e.g., "Alnico", "Neodymium")
 * @param frameSize - Frame size (e.g., "8 inch")
 * @param efficiency - Clean air efficiency (e.g., "98dB")
 * @returns Alt text for instrument images
 */
export function generateInstrumentAltText(
  instrumentTitle: string, 
  collectionTitle: string, 
  magnetType: string,
  frameSize?: string,
  efficiency?: string
): string {
  const frameInfo = frameSize ? ` ${frameSize} frame` : '';
  const efficiencyInfo = efficiency ? ` with ${efficiency} efficiency` : '';
  
  return `${instrumentTitle} drive unit - ${magnetType} magnet${frameInfo}${efficiencyInfo} - Premium Lowther ${instrumentTitle} full-range drive unit from ${collectionTitle} with ${magnetType.toLowerCase()} magnet system`;
}

/**
 * Generates alt text for drive unit cards
 * @param instrumentTitle - Instrument title
 * @param collectionTitle - Collection title
 * @param magnetType - Magnet type
 * @returns Alt text for drive unit card images
 */
export function generateDriveUnitCardAltText(
  instrumentTitle: string, 
  collectionTitle: string, 
  magnetType: string
): string {
  return `${instrumentTitle} - ${collectionTitle} - Premium Lowther ${instrumentTitle} full-range drive unit with ${magnetType.toLowerCase()} magnet system and exceptional efficiency`;
}

/**
 * Generates alt text for featured drive units
 * @param instrumentTitle - Instrument title
 * @param collectionTitle - Collection title
 * @param magnetType - Magnet type
 * @returns Alt text for featured section
 */
export function generateFeaturedDriveUnitAltText(
  instrumentTitle: string, 
  collectionTitle: string, 
  magnetType: string
): string {
  return `Featured ${instrumentTitle} drive unit - Discover the ${instrumentTitle} from Lowther's ${collectionTitle}, a premium full-range drive unit with ${magnetType.toLowerCase()} magnet system`;
}

/**
 * Generates alt text based on filename strategy
 * @param filename - The image filename
 * @param collectionTitle - Collection title
 * @param instrumentTitle - Instrument title (optional)
 * @returns Alt text based on filename analysis
 */
export function generateAltTextFromFilename(
  filename: string,
  collectionTitle: string,
  instrumentTitle?: string
): string {
  const baseName = filename.toLowerCase().split('.')[0];
  
  // Common patterns for drive unit filenames
  if (baseName.includes('hero') || baseName.includes('main')) {
    return `${instrumentTitle || collectionTitle} drive unit - Professional product photography showing premium craftsmanship`;
  }
  if (baseName.includes('detail') || baseName.includes('close')) {
    return `${instrumentTitle || collectionTitle} drive unit details - Close-up view showing construction and materials`;
  }
  if (baseName.includes('technical') || baseName.includes('spec')) {
    return `${instrumentTitle || collectionTitle} technical specifications - Technical diagrams and performance data`;
  }
  if (baseName.includes('comparison') || baseName.includes('vs')) {
    return `${instrumentTitle || collectionTitle} comparison - Side-by-side comparison with other drive units`;
  }
  if (baseName.includes('gallery') || baseName.includes('showcase')) {
    return `${instrumentTitle || collectionTitle} gallery - Multiple views and angles of the drive unit`;
  }
  
  // Default fallback
  return `${instrumentTitle || collectionTitle} drive unit image - Lowther full-range drive unit photography`;
}

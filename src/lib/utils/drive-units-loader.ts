import { readdir } from 'fs/promises';
import { join } from 'path';
import driveUnitsDatabase from '@/lib/data/drive-units-database.json';

export interface DriveUnitImages {
  hero: string[];
  gallery: string[];
  details: string[];
  technical: string[];
}

/**
 * Dynamically loads all images from a collection's image directories
 * @param collectionSlug - The collection's slug (e.g., "concert-collection")
 * @param collectionData - Optional collection data with image base paths
 * @returns Object with arrays of image paths for each category
 */
export async function loadCollectionImages(
  collectionSlug: string, 
  collectionData?: any
): Promise<DriveUnitImages> {
  // Use collection data base path if available, otherwise construct default path
  let basePath: string;
  if (collectionData?.images?.base) {
    // Remove leading slash and 'public/' to get relative path from project root
    const relativePath = collectionData.images.base.replace(/^\//, '').replace(/^public\//, '');
    basePath = join(process.cwd(), 'public', relativePath);
  } else {
    basePath = join(process.cwd(), 'public', 'images', 'drive-units', collectionSlug);
  }
  
  const imageCategories = ['hero', 'gallery', 'details', 'technical'] as const;
  const images: DriveUnitImages = {
    hero: [],
    gallery: [],
    details: [],
    technical: []
  };

  for (const category of imageCategories) {
    try {
      // Use collection data category path if available
      let categoryPath: string;
      if (collectionData?.images?.[category]) {
        categoryPath = join(basePath, collectionData.images[category].replace(/\/$/, ''));
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
          // Construct path using collection data if available
          if (collectionData?.images?.base && collectionData?.images?.[category]) {
            return `${collectionData.images.base}${collectionData.images[category]}${file}`;
          } else {
            return `/images/drive-units/${collectionSlug}/${category}/${file}`;
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
 * Gets all collections from the drive units database
 * @returns Array of collection objects
 */
export function getAllCollections() {
  return driveUnitsDatabase.data.filter((item) => item.type === 'collection');
}

/**
 * Gets a specific collection by slug
 * @param collectionSlug - The collection's slug
 * @returns Collection object or null
 */
export function getCollection(collectionSlug: string) {
  return driveUnitsDatabase.data.find((item) => item.slug === collectionSlug && item.type === 'collection') || null;
}

/**
 * Gets all instruments from a specific collection
 * @param collectionSlug - The collection's slug
 * @returns Array of instrument objects
 */
export function getCollectionInstruments(collectionSlug: string) {
  return driveUnitsDatabase.data.filter((item) => item.type === 'instrument' && (item as any).collection === collectionSlug);
}

/**
 * Gets a specific instrument by ID
 * @param instrumentId - The instrument's ID
 * @returns Instrument object or null
 */
export function getInstrument(instrumentId: string) {
  for (const collection of getAllCollections()) {
    const instrument = collection.instruments.find(inst => inst.id === instrumentId);
    if (instrument) return instrument;
  }
  return null;
}

/**
 * Gets instruments by magnet type across all collections
 * @param magnetType - The magnet type (Alnico, Neodymium, Ceramic)
 * @returns Array of instrument objects
 */
export function getInstrumentsByMagnetType(magnetType: string) {
  const instruments: any[] = [];
  for (const collection of getAllCollections()) {
    const filtered = collection.instruments.filter(inst => 
      inst.magnet_type.toLowerCase() === magnetType.toLowerCase()
    );
    instruments.push(...filtered);
  }
  return instruments;
}

/**
 * Gets instruments by price range across all collections
 * @param minPrice - Minimum price in GBP
 * @param maxPrice - Maximum price in GBP
 * @returns Array of instrument objects
 */
export function getInstrumentsByPriceRange(minPrice: number, maxPrice: number) {
  const instruments: any[] = [];
  for (const collection of getAllCollections()) {
    const filtered = collection.instruments.filter(inst => 
      inst.price_value_gbp >= minPrice && inst.price_value_gbp <= maxPrice
    );
    instruments.push(...filtered);
  }
  return instruments;
}

/**
 * Gets instruments sorted by price (ascending or descending)
 * @param ascending - Sort ascending (true) or descending (false)
 * @returns Array of instrument objects sorted by price
 */
export function getInstrumentsSortedByPrice(ascending: boolean = true) {
  const instruments: any[] = [];
  for (const collection of getAllCollections()) {
    instruments.push(...collection.instruments);
  }
  
  return instruments.sort((a, b) => {
    return ascending 
      ? a.price_value_gbp - b.price_value_gbp
      : b.price_value_gbp - a.price_value_gbp;
  });
}

/**
 * Gets instruments by impedance option
 * @param impedance - The impedance value (8 or 15)
 * @returns Array of instrument objects
 */
export function getInstrumentsByImpedance(impedance: number) {
  const instruments: any[] = [];
  for (const collection of getAllCollections()) {
    const filtered = collection.instruments.filter(inst => 
      inst.impedance_options.includes(impedance)
    );
    instruments.push(...filtered);
  }
  return instruments;
}

/**
 * Gets instruments by frame size across all collections
 * @param frameSize - The frame size (e.g., "8 Inch", "5 Inch")
 * @returns Array of instrument objects
 */
export function getInstrumentsByFrameSize(frameSize: string) {
  const instruments: any[] = [];
  for (const collection of getAllCollections()) {
    const filtered = collection.instruments.filter(inst => 
      inst.frame_size === frameSize
    );
    instruments.push(...filtered);
  }
  return instruments;
}

/**
 * Gets a random instrument from a specific collection
 * @param collectionSlug - The collection's slug
 * @returns Random instrument object or null
 */
export function getRandomInstrument(collectionSlug: string) {
  const instruments = getCollectionInstruments(collectionSlug);
  if (instruments.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * instruments.length);
  return instruments[randomIndex];
}

/**
 * Gets featured instruments (random selection from each collection)
 * @param count - Number of instruments per collection (default: 3)
 * @returns Object with collection slugs as keys and arrays of instruments as values
 */
export function getFeaturedInstruments(count: number = 3) {
  const featured: { [key: string]: any[] } = {};
  
  for (const collection of getAllCollections()) {
    const instruments = [...collection.instruments];
    const shuffled = instruments.sort(() => Math.random() - 0.5);
    featured[collection.slug] = shuffled.slice(0, count);
  }
  
  return featured;
}

/**
 * Gets instruments sorted by collection price tier (Concert → Sinfonia → Philharmonic → Grand Opera)
 * @param ascending - Sort ascending (true) or descending (false)
 * @returns Array of instruments sorted by collection price tier
 */
export function getInstrumentsSortedByCollectionTier(ascending: boolean = true) {
  const collectionOrder = ascending 
    ? ['concert-collection', 'sinfonia-collection', 'philharmonic-collection', 'grand-opera-collection']
    : ['grand-opera-collection', 'philharmonic-collection', 'sinfonia-collection', 'concert-collection'];
  
  const instruments: any[] = [];
  
  for (const collectionSlug of collectionOrder) {
    const collection = getCollection(collectionSlug);
    if (collection) {
      instruments.push(...collection.instruments);
    }
  }
  
  return instruments;
}

/**
 * Gets instruments that are commission-based (Grand Opera Collection)
 * @returns Array of commission-based instruments
 */
export function getCommissionBasedInstruments() {
  const instruments: any[] = [];
  for (const collection of getAllCollections()) {
    const filtered = collection.instruments.filter(inst => inst.commission_based === true);
    instruments.push(...filtered);
  }
  return instruments;
}

/**
 * Gets instruments with fixed pricing (excludes commission-based)
 * @returns Array of fixed-price instruments
 */
export function getFixedPriceInstruments() {
  const instruments: any[] = [];
  for (const collection of getAllCollections()) {
    const filtered = collection.instruments.filter(inst => inst.commission_based !== true);
    instruments.push(...filtered);
  }
  return instruments;
}

/**
 * Gets instruments by overall diameter
 * @param diameter - The overall diameter (e.g., "22.5 cm")
 * @returns Array of instruments with matching diameter
 */
export function getInstrumentsByOverallDiameter(diameter: string) {
  const instruments: any[] = [];
  for (const collection of getAllCollections()) {
    const filtered = collection.instruments.filter(inst => inst.overall_diameter === diameter);
    instruments.push(...filtered);
  }
  return instruments;
}

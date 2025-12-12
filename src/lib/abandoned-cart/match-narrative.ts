/**
 * Match Narratives to Cart Items
 * Maps cart items to product narratives for email content
 */

import { ProductNarrative, PRODUCT_NARRATIVES } from './narratives';
import { CartItem } from './email-templates';

/**
 * Normalize product name for matching
 * Removes common suffixes and normalizes spacing
 */
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get narratives for cart items
 * Matches cart items to ProductNarrative by name, ID, or handle
 * Skips items that don't have a match
 */
export function getNarrativesForCartItems(
  cartItems: CartItem[]
): ProductNarrative[] {
  const narratives: ProductNarrative[] = [];
  
  for (const item of cartItems) {
    // Try to find a matching narrative
    let match: ProductNarrative | undefined;
    
    // First try by productId (if it matches narrative id)
    if (item.productId) {
      match = PRODUCT_NARRATIVES.find(
        (n: ProductNarrative) => n.id === item.productId
      );
    }
    
    // If no match, try by handle (if it matches narrative id)
    if (!match && item.handle) {
      match = PRODUCT_NARRATIVES.find(
        (n: ProductNarrative) => n.id === item.handle
      );
    }
    
    // If still no match, try by title/name (fuzzy match)
    if (!match && item.title) {
      const itemTitleNormalized = normalizeProductName(item.title);
      
      match = PRODUCT_NARRATIVES.find((n: ProductNarrative) => {
        const narrativeNameNormalized = normalizeProductName(n.name);
        
        // Exact match (should catch "pm6a concert" === "pm6a concert")
        if (itemTitleNormalized === narrativeNameNormalized) {
          return true;
        }
        
        // Extract product identifier (e.g., "dx2", "pm6a", "pm4a") from both
        const extractIdentifier = (name: string): string => {
          // Match patterns like "dx2", "pm6a", "ex3", "pm4a", etc.
          const match = name.match(/([a-z]{1,3}\d+[a-z]?)/i);
          return match ? match[1].toLowerCase() : '';
        };
        
        const itemIdentifier = extractIdentifier(itemTitleNormalized);
        const narrativeIdentifier = extractIdentifier(narrativeNameNormalized);
        
        // Extract collection name if present
        const extractCollection = (name: string): string | null => {
          const collections = ['concert', 'sinfonia', 'philharmonic'];
          for (const collection of collections) {
            if (name.includes(collection)) {
              return collection;
            }
          }
          return null;
        };
        
        const itemCollection = extractCollection(itemTitleNormalized);
        const narrativeCollection = extractCollection(narrativeNameNormalized);
        
        // If identifiers match, check collection compatibility
        if (itemIdentifier && narrativeIdentifier && itemIdentifier === narrativeIdentifier) {
          // If both have collections, they must match
          if (itemCollection && narrativeCollection) {
            return itemCollection === narrativeCollection;
          }
          // If only one has a collection, it's still a match (for backwards compatibility)
          // But prefer exact collection matches
          return true;
        }
        
        // Check if item title contains narrative name or vice versa (but only if collections match or both are missing)
        if (itemTitleNormalized.includes(narrativeNameNormalized) || 
            narrativeNameNormalized.includes(itemTitleNormalized)) {
          // If both have collections, they must match
          if (itemCollection && narrativeCollection) {
            return itemCollection === narrativeCollection;
          }
          return true;
        }
        
        // Fallback: Check word-by-word matching, but respect collection names
        const narrativeWords = narrativeNameNormalized.split(/\s+/);
        const itemWords = itemTitleNormalized.split(/\s+/);
        
        // Check if any significant word from narrative appears in item title
        let hasMatchingIdentifier = false;
        for (const narrativeWord of narrativeWords) {
          // Skip common words, but keep collection names for matching
          if (narrativeWord.length < 2) {
            continue;
          }
          
          // If this is a collection name, check if it matches
          if (['concert', 'sinfonia', 'philharmonic'].includes(narrativeWord)) {
            if (!itemWords.includes(narrativeWord)) {
              return false; // Collection mismatch
            }
            continue;
          }
          
          // Check if identifier word matches
          if (itemWords.some(itemWord => itemWord === narrativeWord || itemWord.includes(narrativeWord) || narrativeWord.includes(itemWord))) {
            hasMatchingIdentifier = true;
          }
        }
        
        // If we found a matching identifier and collections are compatible, it's a match
        if (hasMatchingIdentifier) {
          // If both have collections, they must match
          if (itemCollection && narrativeCollection) {
            return itemCollection === narrativeCollection;
          }
          return true;
        }
        
        return false;
      });
    }
    
    // Add match if found (avoid duplicates)
    if (match && !narratives.find(n => n.id === match!.id)) {
      narratives.push(match);
    }
  }
  
  return narratives;
}


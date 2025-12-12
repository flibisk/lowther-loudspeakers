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
        
        // Check if item title contains narrative name or vice versa
        if (itemTitleNormalized.includes(narrativeNameNormalized) || 
            narrativeNameNormalized.includes(itemTitleNormalized)) {
          return true;
        }
        
        // Extract product identifier (e.g., "dx2", "pm6a", "pm4a") from both
        // This handles cases like "PM6A Concert" matching "PM6A Concert"
        const extractIdentifier = (name: string): string => {
          // Match patterns like "dx2", "pm6a", "ex3", "pm4a", etc.
          const match = name.match(/([a-z]{1,3}\d+[a-z]?)/i);
          return match ? match[1].toLowerCase() : '';
        };
        
        const itemIdentifier = extractIdentifier(itemTitleNormalized);
        const narrativeIdentifier = extractIdentifier(narrativeNameNormalized);
        
        // If we found identifiers and they match, it's a match
        if (itemIdentifier && narrativeIdentifier && itemIdentifier === narrativeIdentifier) {
          return true;
        }
        
        // Fallback: Check word-by-word matching
        // Split and check if key words match (e.g., "pm6a" in both)
        const narrativeWords = narrativeNameNormalized.split(/\s+/);
        const itemWords = itemTitleNormalized.split(/\s+/);
        
        // Check if any significant word from narrative appears in item title
        for (const narrativeWord of narrativeWords) {
          // Skip common words
          if (narrativeWord.length < 2 || ['concert', 'sinfonia', 'philharmonic'].includes(narrativeWord)) {
            continue;
          }
          // If narrative word appears in item title, it's likely a match
          if (itemWords.some(itemWord => itemWord === narrativeWord || itemWord.includes(narrativeWord) || narrativeWord.includes(itemWord))) {
            return true;
          }
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


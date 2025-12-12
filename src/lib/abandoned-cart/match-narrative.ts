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
        
        // Exact match
        if (itemTitleNormalized === narrativeNameNormalized) {
          return true;
        }
        
        // Check if item title contains narrative name (e.g., "DX2 Concert" contains "DX2")
        if (itemTitleNormalized.includes(narrativeNameNormalized) || 
            narrativeNameNormalized.includes(itemTitleNormalized)) {
          return true;
        }
        
        // Check if narrative name contains key parts (e.g., "DX2" in "DX2 Concert")
        const narrativeParts = narrativeNameNormalized.split(' ');
        const itemParts = itemTitleNormalized.split(' ');
        
        // Match if key identifier matches (e.g., "dx2", "pm6a")
        for (const part of narrativeParts) {
          if (part.length >= 2 && itemParts.some(itemPart => itemPart.includes(part) || part.includes(itemPart))) {
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


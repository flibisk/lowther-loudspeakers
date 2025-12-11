/**
 * Match Narratives to Cart Items
 * Maps cart items to product narratives for email content
 */

import { ProductNarrative } from './narratives';
import { CartItem } from './email-templates';

/**
 * Get narratives for cart items
 * Matches cart items to ProductNarrative by product ID or handle
 * Skips items that don't have a match
 */
export function getNarrativesForCartItems(
  cartItems: CartItem[]
): ProductNarrative[] {
  // Import narratives dynamically to avoid circular dependencies
  const { PRODUCT_NARRATIVES } = require('./narratives');
  
  const narratives: ProductNarrative[] = [];
  
  for (const item of cartItems) {
    // Try to find a matching narrative
    let match: ProductNarrative | undefined;
    
    // First try by productId
    if (item.productId) {
      match = PRODUCT_NARRATIVES.find(
        (n: ProductNarrative) => n.productId === item.productId
      );
    }
    
    // If no match, try by handle
    if (!match && item.handle) {
      match = PRODUCT_NARRATIVES.find(
        (n: ProductNarrative) => n.handle === item.handle
      );
    }
    
    // If still no match, try by title (fuzzy match)
    if (!match && item.title) {
      const itemTitleLower = item.title.toLowerCase();
      match = PRODUCT_NARRATIVES.find(
        (n: ProductNarrative) => 
          n.title && itemTitleLower.includes(n.title.toLowerCase()) ||
          n.handle && itemTitleLower.includes(n.handle.toLowerCase())
      );
    }
    
    // Add match if found
    if (match) {
      narratives.push(match);
    }
  }
  
  return narratives;
}


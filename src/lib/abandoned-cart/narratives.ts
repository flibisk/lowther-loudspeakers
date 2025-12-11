/**
 * Product Narratives
 * Contains product stories and descriptions for abandoned cart emails
 */

export interface ProductNarrative {
  productId?: string;
  handle?: string;
  title?: string;
  rangePosition: string;
  soundCharacter: string;
  cabinetMatches: string;
}

/**
 * PRODUCT_NARRATIVES array
 * 
 * TODO: User will paste the existing array here
 * For now, this is a placeholder structure
 */
export const PRODUCT_NARRATIVES: ProductNarrative[] = [
  // User will provide the actual array content
];


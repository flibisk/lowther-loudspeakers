/**
 * Utility functions to parse drive unit strings and convert them to Shopify handles
 * 
 * Examples:
 * - "2x DX3 Concert" -> { handle: "dx3-concert", quantity: 2, label: "DX3 Concert" }
 * - "4x PM7A Sinfonia" -> { handle: "pm7a-sinfonia", quantity: 4, label: "PM7A Sinfonia" }
 */

export interface ParsedDriveUnit {
  handle: string;
  quantity: number;
  label: string;
  collection: 'concert' | 'sinfonia' | 'philharmonic' | 'grand-opera' | null;
}

/**
 * Converts a drive unit name to a Shopify handle
 * Examples:
 * - "DX3 Concert" -> "dx3-concert"
 * - "PM7A Sinfonia" -> "pm7a-sinfonia"
 * - "EX3 Concert" -> "ex3-concert"
 */
function nameToHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .trim();
}

/**
 * Detects the collection from the drive unit name
 */
function detectCollection(name: string): 'concert' | 'sinfonia' | 'philharmonic' | 'grand-opera' | null {
  const lower = name.toLowerCase();
  if (lower.includes('sinfonia')) return 'sinfonia';
  if (lower.includes('philharmonic')) return 'philharmonic';
  if (lower.includes('grand-opera') || lower.includes('grand opera')) return 'grand-opera';
  if (lower.includes('concert')) return 'concert';
  return null;
}

/**
 * Parses a drive unit string like "2x DX3 Concert" or "4x PM7A Sinfonia"
 */
export function parseDriveUnitString(input: string): ParsedDriveUnit | null {
  if (!input || typeof input !== 'string') return null;

  // Remove "plus" and split by it if present (e.g., "2x DX3 Concert plus 2x DX55")
  const parts = input.split(/plus|and/i).map(p => p.trim());
  
  // For now, we'll just handle the first part
  // TODO: Handle multiple drive units in one string
  const firstPart = parts[0];

  // Match pattern like "2x DX3 Concert" or "DX3 Concert"
  // Also handle cases like "2x DX3 Concert" with optional spacing
  const match = firstPart.match(/^(\d+)x\s*(.+)$/i) || firstPart.match(/^(.+)$/);
  
  if (!match) return null;

  const quantity = match[1] ? parseInt(match[1], 10) : 1;
  const name = (match[2] || match[1]).trim();
  
  if (!name) return null;

  const handle = nameToHandle(name);
  const collection = detectCollection(name);

  return {
    handle,
    quantity,
    label: name,
    collection,
  };
}

/**
 * Gets the Shopify collection handle from a collection name
 */
export function getCollectionHandle(collection: ParsedDriveUnit['collection']): string | null {
  const collectionMap: Record<string, string> = {
    'concert': 'the-concert-collection',
    'sinfonia': 'the-sinfonia-collection',
    'philharmonic': 'the-philharmonic-collection',
    'grand-opera': 'the-grand-opera-collection',
  };

  return collection ? collectionMap[collection] || null : null;
}


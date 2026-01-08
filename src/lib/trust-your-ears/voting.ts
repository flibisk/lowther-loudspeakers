/**
 * Vote tracking and duplicate prevention
 * Uses cookie ID + IP hash to identify unique voters
 */

import { createHash } from 'crypto';

/**
 * Generate a unique voter hash from cookie ID and IP address
 * @param ipAddress - Client IP address
 * @param cookieId - Optional cookie ID (if not provided, will use IP only)
 */
export function generateVoterHash(ipAddress: string, cookieId?: string): string {
  // If no cookie ID, use IP + timestamp + random for uniqueness
  // This is less ideal but works for anonymous voting
  const identifier = cookieId 
    ? `${cookieId}-${ipAddress}`
    : `${ipAddress}-${Date.now()}-${Math.random()}`;

  // Create hash of identifier
  const hash = createHash('sha256')
    .update(identifier)
    .digest('hex');

  return hash;
}

/**
 * Get voter ID from localStorage (for client-side use)
 * Note: This is a simple implementation. In production, consider using
 * a more robust solution or server-side cookie management.
 */
export function getVoterId(): string | null {
  if (typeof window === 'undefined') return null;
  
  let voterId = localStorage.getItem('trust-your-ears-voter-id');
  
  if (!voterId) {
    // Generate a simple ID (not cryptographically secure, but sufficient for MVP)
    voterId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('trust-your-ears-voter-id', voterId);
  }
  
  return voterId;
}

/**
 * Get IP address from request headers
 */
export function getClientIp(headers: Headers): string {
  // Check various headers for IP address
  const forwarded = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'unknown';
}

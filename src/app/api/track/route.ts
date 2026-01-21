import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

// Valid event types
const VALID_EVENT_TYPES = [
  'PAGE_VIEW',
  'CTA_CLICK',
  'VIDEO_PLAY',
  'DOWNLOAD_BROCHURE',
  'FORM_SUBMIT',
  'PRODUCT_VIEW',
  'ADD_TO_CART',
  'BEGIN_CHECKOUT',
  'TRUST_YOUR_EARS_VOTE',
  'ENQUIRY_START',
  'ENQUIRY_SUBMIT',
  'PRODUCT_REVISIT',
  'BLOG_DEEP_READ',
];

// Admin emails that should not be tracked
const EXCLUDED_EMAILS = [
  'social@lowtherloudspeakers.com',
  'hello@lowtherloudspeakers.com',
];

// Get authenticated user ID if logged in, returns null if admin
async function getUserId(): Promise<{ userId: string | null; isAdmin: boolean }> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tye_session');
  
  if (!sessionCookie?.value) {
    return { userId: null, isAdmin: false };
  }
  
  const [userId] = sessionCookie.value.split(':');
  if (!userId) {
    return { userId: null, isAdmin: false };
  }
  
  // Check if this is an admin user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  
  if (user && EXCLUDED_EMAILS.includes(user.email)) {
    return { userId, isAdmin: true };
  }
  
  return { userId, isAdmin: false };
}

// Get IP address from request
function getClientIp(request: NextRequest): string | null {
  // Check various headers for the real IP (behind proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Vercel-specific header
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) {
    return vercelIp.split(',')[0].trim();
  }
  
  return null;
}

// Simple in-memory cache for IP geolocation (to avoid hitting API too often)
const geoCache = new Map<string, { country: string; city: string; expires: number }>();
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Get geolocation from IP (using free ip-api.com)
async function getGeoFromIp(ip: string): Promise<{ country: string; city: string } | null> {
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return null;
  }
  
  // Check cache
  const cached = geoCache.get(ip);
  if (cached && cached.expires > Date.now()) {
    return { country: cached.country, city: cached.city };
  }
  
  try {
    // ip-api.com is free for non-commercial use (45 requests per minute)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, {
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.status === 'success') {
      const result = { country: data.country || 'Unknown', city: data.city || '' };
      
      // Cache the result
      geoCache.set(ip, {
        ...result,
        expires: Date.now() + GEO_CACHE_TTL,
      });
      
      // Clean up old cache entries periodically
      if (geoCache.size > 10000) {
        const now = Date.now();
        for (const [key, value] of geoCache.entries()) {
          if (value.expires < now) {
            geoCache.delete(key);
          }
        }
      }
      
      return result;
    }
  } catch (error) {
    // Silently fail - geolocation is not critical
    console.debug('[TRACK] Geolocation failed:', error);
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, eventData, path, sessionId, referrer } = body;

    // Validate event type
    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Validate path
    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    // Skip tracking for admin pages
    if (path.startsWith('/admin')) {
      return NextResponse.json({ success: true, skipped: true });
    }

    // Validate sessionId
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get user ID if authenticated
    const { userId, isAdmin } = await getUserId();

    // Skip tracking for admin users
    if (isAdmin) {
      return NextResponse.json({ success: true, skipped: true });
    }

    // Get user agent and IP from headers
    const userAgent = request.headers.get('user-agent') || null;
    const ipAddress = getClientIp(request);
    
    // Get geolocation (async, but we won't wait for it to complete to speed up response)
    let geoData: { country: string; city: string } | null = null;
    if (ipAddress) {
      geoData = await getGeoFromIp(ipAddress);
    }

    // Merge geo data into event data
    const enrichedEventData = {
      ...eventData,
      ...(ipAddress && { ip: ipAddress }),
      ...(geoData && { country: geoData.country, city: geoData.city }),
    };

    // Create the event
    await prisma.userEvent.create({
      data: {
        userId,
        sessionId,
        eventType: eventType as any,
        eventData: Object.keys(enrichedEventData).length > 0 ? enrichedEventData : null,
        path,
        referrer: referrer || null,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[TRACK] Error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

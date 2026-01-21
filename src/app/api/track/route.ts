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

// Get authenticated user ID if logged in
async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tye_session');
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  const [userId] = sessionCookie.value.split(':');
  return userId || null;
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
    const userId = await getUserId();

    // Get user agent from headers
    const userAgent = request.headers.get('user-agent') || null;

    // Create the event
    await prisma.userEvent.create({
      data: {
        userId,
        sessionId,
        eventType: eventType as any,
        eventData: eventData || null,
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

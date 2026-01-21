import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

const ADMIN_EMAILS = [
  'social@lowtherloudspeakers.com',
  'hello@lowtherloudspeakers.com',
];

// Lead scoring values
const LEAD_SCORES: Record<string, number> = {
  PAGE_VIEW: 1,
  PRODUCT_VIEW: 5,
  PRODUCT_REVISIT: 3,
  VIDEO_PLAY: 3,
  DOWNLOAD_BROCHURE: 10,
  FORM_SUBMIT: 15,
  CTA_CLICK: 2,
  ADD_TO_CART: 20,
  BEGIN_CHECKOUT: 30,
  ENQUIRY_START: 5,
  ENQUIRY_SUBMIT: 25,
  TRUST_YOUR_EARS_VOTE: 3,
  BLOG_DEEP_READ: 4,
};

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tye_session');

  if (!sessionCookie?.value) return false;

  const [userId] = sessionCookie.value.split(':');
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, role: true },
  });

  if (!user) return false;
  return user.role === 'ADMIN' || ADMIN_EMAILS.includes(user.email);
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Get all page views for this path, grouped by user/session
    const pageViewsByUser = await prisma.userEvent.groupBy({
      by: ['userId', 'sessionId'],
      where: {
        path,
        eventType: 'PAGE_VIEW',
      },
      _count: true,
      _max: {
        timestamp: true,
      },
    });

    // Build user data with score and CTA clicks
    const usersData = await Promise.all(
      pageViewsByUser.map(async (pv) => {
        // Get user info if logged in
        let userInfo = null;
        if (pv.userId) {
          userInfo = await prisma.user.findUnique({
            where: { id: pv.userId },
            select: {
              id: true,
              email: true,
              displayName: true,
              fullName: true,
              country: true,
            },
          });
        }

        // Calculate lead score for this user
        let leadScore = 0;
        if (pv.userId) {
          const eventCounts = await prisma.userEvent.groupBy({
            by: ['eventType'],
            where: { userId: pv.userId },
            _count: true,
          });

          for (const ec of eventCounts) {
            const weight = LEAD_SCORES[ec.eventType as keyof typeof LEAD_SCORES] || 1;
            leadScore += ec._count * weight;
          }
        }

        // Count CTA clicks on this specific page
        const ctaClicks = await prisma.userEvent.count({
          where: {
            path,
            eventType: 'CTA_CLICK',
            OR: pv.userId 
              ? [{ userId: pv.userId }, { sessionId: pv.sessionId }]
              : [{ sessionId: pv.sessionId }],
          },
        });

        return {
          userId: pv.userId,
          email: userInfo?.email || null,
          displayName: userInfo?.displayName || userInfo?.fullName || null,
          country: userInfo?.country || null,
          visitCount: pv._count,
          ctaClicks,
          leadScore,
          lastVisit: pv._max.timestamp?.toISOString() || new Date().toISOString(),
        };
      })
    );

    // Sort by lead score (highest first), then by visit count
    usersData.sort((a, b) => {
      if (b.leadScore !== a.leadScore) {
        return b.leadScore - a.leadScore;
      }
      return b.visitCount - a.visitCount;
    });

    // Limit to top 100 users
    const limitedUsers = usersData.slice(0, 100);

    return NextResponse.json({ users: limitedUsers });
  } catch (error) {
    console.error('[ADMIN PAGES USERS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load page users' },
      { status: 500 }
    );
  }
}

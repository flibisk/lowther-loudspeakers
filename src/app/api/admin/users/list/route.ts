import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

// Admin emails that have access
const ADMIN_EMAILS = [
  'social@lowtherloudspeakers.com',
  'hello@lowtherloudspeakers.com',
];

// Lead scoring configuration
// +1 for unique page views, +3 for return visits
const SCORE_WEIGHTS = {
  PAGE_VIEW: 1,          // Unique page view
  PRODUCT_VIEW: 5,       // First view of a product
  PRODUCT_REVISIT: 3,    // Return visit to a product
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

  if (!sessionCookie?.value) {
    return false;
  }

  const [userId] = sessionCookie.value.split(':');
  if (!userId) {
    return false;
  }

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
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get all users with their event counts
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        fullName: true,
        country: true,
        level: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate lead scores for each user
    const usersWithScores = await Promise.all(
      users.map(async (user) => {
        // Get event counts by type
        const eventCounts = await prisma.userEvent.groupBy({
          by: ['eventType'],
          where: { userId: user.id },
          _count: true,
        });

        // Calculate total events
        const totalEvents = eventCounts.reduce((sum, ec) => sum + ec._count, 0);

        // Calculate lead score
        let leadScore = 0;
        for (const ec of eventCounts) {
          const weight = SCORE_WEIGHTS[ec.eventType as keyof typeof SCORE_WEIGHTS] || 1;
          leadScore += ec._count * weight;
        }

        return {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          fullName: user.fullName,
          country: user.country,
          level: user.level,
          createdAt: user.createdAt.toISOString(),
          eventCount: totalEvents,
          leadScore,
        };
      })
    );

    // Sort by lead score (highest first)
    usersWithScores.sort((a, b) => b.leadScore - a.leadScore);

    // Apply pagination
    const paginatedUsers = usersWithScores.slice(offset, offset + limit);
    const hasMore = offset + limit < usersWithScores.length;

    return NextResponse.json({
      users: paginatedUsers,
      total: usersWithScores.length,
      hasMore,
    });
  } catch (error) {
    console.error('[ADMIN USERS LIST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load users' },
      { status: 500 }
    );
  }
}

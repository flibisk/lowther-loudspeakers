import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

// Lead scoring values - +1 for unique page views, +3 for return visits
const LEAD_SCORES: Record<string, number> = {
  PAGE_VIEW: 1,           // Unique page view
  PRODUCT_VIEW: 5,        // First product view
  PRODUCT_REVISIT: 3,     // Return visit to product
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

const ADMIN_EMAILS = [
  'social@lowtherloudspeakers.com',
  'hello@lowtherloudspeakers.com',
];

async function verifyAdmin() {
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
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ users: [] });
    }

    // Search users by email
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: query.toLowerCase(),
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        fullName: true,
        country: true,
        level: true,
        createdAt: true,
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    // Get event counts and lead scores for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get total event count
        const eventCount = await prisma.userEvent.count({
          where: { userId: user.id },
        });

        // Calculate lead score
        const scoringEvents = await prisma.userEvent.findMany({
          where: {
            userId: user.id,
            eventType: {
              in: Object.keys(LEAD_SCORES) as any[],
            },
          },
          select: { eventType: true },
        });

        const leadScore = scoringEvents.reduce((score, event) => {
          return score + (LEAD_SCORES[event.eventType] || 0);
        }, 0);

        return {
          ...user,
          eventCount,
          leadScore,
        };
      })
    );

    // Sort by lead score descending
    usersWithStats.sort((a, b) => b.leadScore - a.leadScore);

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error('[ADMIN USER SEARCH] Error:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}

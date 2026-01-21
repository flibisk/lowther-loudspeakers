import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

// Lead scoring values
const LEAD_SCORES: Record<string, number> = {
  ENQUIRY_SUBMIT: 10,
  BEGIN_CHECKOUT: 6,
  ENQUIRY_START: 5,
  PRODUCT_REVISIT: 3,
  DOWNLOAD_BROCHURE: 2,
  BLOG_DEEP_READ: 1,
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

function getDateRange(range: string): Date {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const startDate = getDateRange(range);

    // Get users with scoring events in the time range
    const scoringEventTypes = Object.keys(LEAD_SCORES);
    
    const usersWithEvents = await prisma.user.findMany({
      where: {
        events: {
          some: {
            eventType: { in: scoringEventTypes as any[] },
            timestamp: { gte: startDate },
          },
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
    });

    // Calculate scores and gather details for each user
    const leadsWithScores = await Promise.all(
      usersWithEvents.map(async (user) => {
        // Get scoring events
        const scoringEvents = await prisma.userEvent.findMany({
          where: {
            userId: user.id,
            eventType: { in: scoringEventTypes as any[] },
            timestamp: { gte: startDate },
          },
          select: { eventType: true },
        });

        // Calculate score breakdown
        const breakdown: Record<string, { count: number; points: number }> = {};
        let totalScore = 0;

        for (const event of scoringEvents) {
          const points = LEAD_SCORES[event.eventType] || 0;
          if (!breakdown[event.eventType]) {
            breakdown[event.eventType] = { count: 0, points: 0 };
          }
          breakdown[event.eventType].count++;
          breakdown[event.eventType].points += points;
          totalScore += points;
        }

        const scoreBreakdown = Object.entries(breakdown)
          .map(([type, data]) => ({ type, ...data }))
          .sort((a, b) => b.points - a.points);

        // Get top interests (products/collections)
        const productEvents = await prisma.userEvent.findMany({
          where: {
            userId: user.id,
            eventType: { in: ['PRODUCT_VIEW', 'ADD_TO_CART', 'BEGIN_CHECKOUT'] },
            timestamp: { gte: startDate },
            eventData: { not: null },
          },
          select: { eventData: true },
        });

        const interests: Record<string, number> = {};
        for (const event of productEvents) {
          const data = event.eventData as any;
          if (data?.productHandle) {
            interests[data.productHandle] = (interests[data.productHandle] || 0) + 1;
          }
        }

        const topInterests = Object.entries(interests)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name);

        // Get last activity
        const lastEvent = await prisma.userEvent.findFirst({
          where: { userId: user.id },
          orderBy: { timestamp: 'desc' },
          select: { timestamp: true },
        });

        return {
          ...user,
          score: totalScore,
          scoreBreakdown,
          topInterests,
          lastActivity: lastEvent?.timestamp?.toISOString() || null,
        };
      })
    );

    // Sort by score descending and filter out zero scores
    const leads = leadsWithScores
      .filter(lead => lead.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Top 50 leads

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('[ADMIN LEADS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

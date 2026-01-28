import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

// Admin emails that have access
const ADMIN_EMAILS = [
  'social@lowtherloudspeakers.com',
  'hello@lowtherloudspeakers.com',
];

async function verifyAdmin() {
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

    // Total page views in range
    const totalPageViews = await prisma.userEvent.count({
      where: {
        eventType: 'PAGE_VIEW',
        timestamp: { gte: startDate },
      },
    });

    // New users in range
    const newUsers = await prisma.user.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Total users
    const totalUsers = await prisma.user.count();

    // Catalogue downloads in range
    const catalogueDownloads = await prisma.userEvent.count({
      where: {
        eventType: 'DOWNLOAD_BROCHURE',
        timestamp: { gte: startDate },
      },
    });

    // Plan downloads in range
    const planDownloads = await prisma.userEvent.count({
      where: {
        eventType: 'DOWNLOAD_PLAN',
        timestamp: { gte: startDate },
      },
    });

    // Top pages
    const topPagesRaw = await prisma.userEvent.groupBy({
      by: ['path'],
      where: {
        eventType: 'PAGE_VIEW',
        timestamp: { gte: startDate },
      },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    });

    const topPages = topPagesRaw.map(p => ({
      path: p.path,
      count: p._count.path,
    }));

    // Top products (from product views)
    const productViewsRaw = await prisma.userEvent.findMany({
      where: {
        eventType: 'PRODUCT_VIEW',
        timestamp: { gte: startDate },
      },
      select: { eventData: true },
    });

    // Aggregate product handles
    const productCounts: Record<string, number> = {};
    for (const event of productViewsRaw) {
      if (!event.eventData) continue;
      const data = event.eventData as any;
      if (data?.productHandle) {
        productCounts[data.productHandle] = (productCounts[data.productHandle] || 0) + 1;
      }
    }

    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([handle, count]) => ({ handle, count }));

    // Top user by event count
    const topUserRaw = await prisma.userEvent.groupBy({
      by: ['userId'],
      where: {
        userId: { not: null },
        timestamp: { gte: startDate },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    });

    let topUser = null;
    if (topUserRaw.length > 0 && topUserRaw[0].userId) {
      const user = await prisma.user.findUnique({
        where: { id: topUserRaw[0].userId },
        select: { id: true, email: true, displayName: true },
      });
      if (user) {
        topUser = {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          eventCount: topUserRaw[0]._count.id,
        };
      }
    }

    // Top countries (from event data)
    const allEvents = await prisma.userEvent.findMany({
      where: {
        timestamp: { gte: startDate },
      },
      select: { eventData: true },
    });

    const countryCounts: Record<string, number> = {};
    for (const event of allEvents) {
      if (!event.eventData) continue;
      const data = event.eventData as any;
      if (data?.country) {
        countryCounts[data.country] = (countryCounts[data.country] || 0) + 1;
      }
    }

    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    // Event breakdown
    const eventBreakdownRaw = await prisma.userEvent.groupBy({
      by: ['eventType'],
      where: {
        timestamp: { gte: startDate },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const eventBreakdown = eventBreakdownRaw.map(e => ({
      type: e.eventType,
      count: e._count.id,
    }));

    return NextResponse.json({
      totalPageViews,
      newUsers,
      totalUsers,
      catalogueDownloads,
      planDownloads,
      topPages,
      topProducts,
      topCountries,
      topUser,
      eventBreakdown,
    });
  } catch (error) {
    console.error('[ADMIN STATS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

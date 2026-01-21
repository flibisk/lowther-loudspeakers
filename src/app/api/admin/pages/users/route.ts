import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

const ADMIN_EMAILS = [
  'social@lowtherloudspeakers.com',
  'hello@lowtherloudspeakers.com',
];

// Action event types we want to track
const ACTION_TYPES = [
  'CTA_CLICK',
  'VIDEO_PLAY',
  'FORM_SUBMIT',
  'ENQUIRY_START',
  'ENQUIRY_SUBMIT',
  'DOWNLOAD_BROCHURE',
  'ADD_TO_CART',
  'BEGIN_CHECKOUT',
];

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

    // Build user data with actions
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
            },
          });
        }

        // Get actions taken on this page by this user/session
        const actionsRaw = await prisma.userEvent.findMany({
          where: {
            path,
            OR: [
              { userId: pv.userId },
              { sessionId: pv.sessionId },
            ].filter(Boolean),
            eventType: { in: ACTION_TYPES },
          },
          select: {
            eventType: true,
            eventData: true,
          },
        });

        // Aggregate actions
        const actionMap: Record<string, { type: string; productHandle?: string; count: number }> = {};
        for (const action of actionsRaw) {
          const data = action.eventData as any;
          const key = `${action.eventType}-${data?.productHandle || data?.ctaName || ''}`;
          
          if (!actionMap[key]) {
            actionMap[key] = {
              type: action.eventType,
              productHandle: data?.productHandle || data?.ctaName || data?.formType || undefined,
              count: 0,
            };
          }
          actionMap[key].count++;
        }

        return {
          userId: pv.userId,
          email: userInfo?.email || null,
          displayName: userInfo?.displayName || null,
          visitCount: pv._count,
          lastVisit: pv._max.timestamp?.toISOString() || new Date().toISOString(),
          actions: Object.values(actionMap),
        };
      })
    );

    // Sort by visit count (most visits first), then by last visit
    usersData.sort((a, b) => {
      if (b.visitCount !== a.visitCount) {
        return b.visitCount - a.visitCount;
      }
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
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

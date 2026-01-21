import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

const ADMIN_EMAILS = [
  'social@lowtherloudspeakers.com',
  'hello@lowtherloudspeakers.com',
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

    // Get page view counts grouped by path
    const pageViews = await prisma.userEvent.groupBy({
      by: ['path'],
      where: {
        eventType: 'PAGE_VIEW',
        NOT: {
          path: { startsWith: '/admin' },
        },
      },
      _count: {
        path: true,
      },
      orderBy: {
        _count: {
          path: 'desc',
        },
      },
      take: 100,
    });

    // Get unique user counts for each path
    const pagesWithUsers = await Promise.all(
      pageViews.map(async (pv) => {
        const uniqueUsers = await prisma.userEvent.groupBy({
          by: ['userId', 'sessionId'],
          where: {
            path: pv.path,
            eventType: 'PAGE_VIEW',
          },
        });

        return {
          path: pv.path,
          viewCount: pv._count.path,
          uniqueUsers: uniqueUsers.length,
        };
      })
    );

    return NextResponse.json({ pages: pagesWithUsers });
  } catch (error) {
    console.error('[ADMIN PAGES] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load pages' },
      { status: 500 }
    );
  }
}

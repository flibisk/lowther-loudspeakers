import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get recent events (last 50)
    const events = await prisma.userEvent.findMany({
      where: { userId: id },
      orderBy: { timestamp: 'desc' },
      take: 50,
      select: {
        id: true,
        eventType: true,
        eventData: true,
        path: true,
        timestamp: true,
      },
    });

    // Get total event count
    const totalEvents = await prisma.userEvent.count({
      where: { userId: id },
    });

    // Calculate top interests from product views and other events
    const productEvents = await prisma.userEvent.findMany({
      where: {
        userId: id,
        eventType: { in: ['PRODUCT_VIEW', 'ADD_TO_CART', 'BEGIN_CHECKOUT'] },
      },
      select: { eventData: true },
    });

    // Aggregate interests
    const interests: Record<string, { count: number; type: 'product' | 'collection' }> = {};

    for (const event of productEvents) {
      if (!event.eventData) continue;
      const data = event.eventData as any;
      if (data?.productHandle) {
        const name = data.productHandle;
        if (!interests[name]) {
          interests[name] = { count: 0, type: 'product' };
        }
        interests[name].count++;
      }
      if (data?.collection) {
        const name = data.collection;
        if (!interests[name]) {
          interests[name] = { count: 0, type: 'collection' };
        }
        interests[name].count++;
      }
    }

    const topInterests = Object.entries(interests)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return NextResponse.json({
      events,
      topInterests,
      totalEvents,
    });
  } catch (error) {
    console.error('[ADMIN USER ACTIVITY] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user activity' },
      { status: 500 }
    );
  }
}

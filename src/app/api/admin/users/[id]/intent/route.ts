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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get top pages visited
    const pageViews = await prisma.userEvent.groupBy({
      by: ['path'],
      where: {
        userId: id,
        eventType: 'PAGE_VIEW',
        NOT: { path: { startsWith: '/admin' } },
      },
      _count: true,
      _max: { timestamp: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    });

    const topPages = pageViews.map(pv => ({
      path: pv.path,
      visits: pv._count,
      lastVisit: pv._max.timestamp?.toISOString(),
    }));

    // Get product views with revisit info
    const productEvents = await prisma.userEvent.findMany({
      where: {
        userId: id,
        eventType: { in: ['PRODUCT_VIEW', 'PRODUCT_REVISIT'] },
      },
      select: {
        eventType: true,
        eventData: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'desc' },
    });

    // Aggregate products
    const productMap: Record<string, { views: number; revisits: number; lastSeen: string }> = {};
    for (const event of productEvents) {
      const data = event.eventData as any;
      const handle = data?.productHandle;
      if (!handle) continue;
      
      if (!productMap[handle]) {
        productMap[handle] = { views: 0, revisits: 0, lastSeen: event.timestamp.toISOString() };
      }
      
      if (event.eventType === 'PRODUCT_VIEW') {
        productMap[handle].views++;
      } else {
        productMap[handle].revisits++;
      }
    }

    const products = Object.entries(productMap)
      .map(([handle, data]) => ({ handle, ...data }))
      .sort((a, b) => (b.views + b.revisits) - (a.views + a.revisits));

    // Get cart activity
    const cartEvents = await prisma.userEvent.findMany({
      where: {
        userId: id,
        eventType: { in: ['ADD_TO_CART', 'BEGIN_CHECKOUT'] },
      },
      select: {
        eventType: true,
        eventData: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'desc' },
    });

    const cartItems: { handle: string; addedAt: string }[] = [];
    let hasStartedCheckout = false;
    let lastCheckoutAt: string | null = null;

    for (const event of cartEvents) {
      const data = event.eventData as any;
      if (event.eventType === 'ADD_TO_CART' && data?.productHandle) {
        cartItems.push({
          handle: data.productHandle,
          addedAt: event.timestamp.toISOString(),
        });
      }
      if (event.eventType === 'BEGIN_CHECKOUT') {
        hasStartedCheckout = true;
        lastCheckoutAt = event.timestamp.toISOString();
      }
    }

    // Get videos watched
    const videoEvents = await prisma.userEvent.findMany({
      where: {
        userId: id,
        eventType: 'VIDEO_PLAY',
      },
      select: {
        eventData: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'desc' },
    });

    const videos = videoEvents.map(v => ({
      title: (v.eventData as any)?.videoId || 'Unknown',
      watchedAt: v.timestamp.toISOString(),
    }));

    // Get brochures downloaded
    const brochureEvents = await prisma.userEvent.findMany({
      where: {
        userId: id,
        eventType: 'DOWNLOAD_BROCHURE',
      },
      select: {
        eventData: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'desc' },
    });

    const brochures = brochureEvents.map(b => ({
      id: (b.eventData as any)?.brochureId || 'Unknown',
      downloadedAt: b.timestamp.toISOString(),
    }));

    // Get form activity
    const formEvents = await prisma.userEvent.findMany({
      where: {
        userId: id,
        eventType: { in: ['ENQUIRY_START', 'ENQUIRY_SUBMIT', 'FORM_SUBMIT'] },
      },
      select: {
        eventType: true,
        eventData: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'desc' },
    });

    const forms = formEvents.map(f => ({
      type: (f.eventData as any)?.formType || 'Unknown',
      action: f.eventType === 'ENQUIRY_START' ? 'started' : 'submitted',
      at: f.timestamp.toISOString(),
    }));

    // Get CTA clicks
    const ctaEvents = await prisma.userEvent.findMany({
      where: {
        userId: id,
        eventType: 'CTA_CLICK',
      },
      select: {
        eventData: true,
        path: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    const ctaClicks = ctaEvents.map(c => ({
      name: (c.eventData as any)?.ctaName || 'Unknown',
      page: c.path,
      at: c.timestamp.toISOString(),
    }));

    return NextResponse.json({
      topPages,
      products,
      cart: {
        items: cartItems,
        hasStartedCheckout,
        lastCheckoutAt,
      },
      videos,
      brochures,
      forms,
      ctaClicks,
    });
  } catch (error) {
    console.error('[ADMIN USER INTENT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load user intent' },
      { status: 500 }
    );
  }
}

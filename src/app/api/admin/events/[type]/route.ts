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

// Event type to data field mapping
const EVENT_DATA_FIELDS: Record<string, { idField: string; titleField: string; label: string }> = {
  'DOWNLOAD_BROCHURE': { idField: 'brochureId', titleField: 'brochureTitle', label: 'Catalogue' },
  'DOWNLOAD_PLAN': { idField: 'planId', titleField: 'planTitle', label: 'Plan' },
  'VIDEO_PLAY': { idField: 'videoId', titleField: 'videoTitle', label: 'Video' },
  'FORM_SUBMIT': { idField: 'formType', titleField: 'formType', label: 'Form' },
  'CTA_CLICK': { idField: 'ctaName', titleField: 'ctaName', label: 'CTA' },
  'PRODUCT_VIEW': { idField: 'productHandle', titleField: 'productHandle', label: 'Product' },
  'PRODUCT_REVISIT': { idField: 'productHandle', titleField: 'productHandle', label: 'Product' },
  'ENQUIRY_START': { idField: 'formType', titleField: 'formType', label: 'Enquiry' },
  'ENQUIRY_SUBMIT': { idField: 'formType', titleField: 'formType', label: 'Enquiry' },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const startDate = getDateRange(range);

    // Get all events of this type
    const events = await prisma.userEvent.findMany({
      where: {
        eventType: type as any,
        timestamp: { gte: startDate },
      },
      select: {
        id: true,
        eventData: true,
        timestamp: true,
        userId: true,
        user: {
          select: {
            email: true,
            displayName: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    // Get field info for this event type
    const fieldInfo = EVENT_DATA_FIELDS[type];
    
    if (!fieldInfo) {
      // For events without specific data (like PAGE_VIEW), just return count
      return NextResponse.json({
        eventType: type,
        totalCount: events.length,
        items: [],
        label: type.replace(/_/g, ' ').toLowerCase(),
      });
    }

    // Aggregate by the ID field
    const aggregated: Record<string, {
      id: string;
      title: string;
      count: number;
      users: { email: string | null; displayName: string | null }[];
      lastOccurred: Date;
    }> = {};

    for (const event of events) {
      const data = event.eventData as any;
      if (!data) continue;

      const id = data[fieldInfo.idField];
      if (!id) continue;

      const title = data[fieldInfo.titleField] || id;

      if (!aggregated[id]) {
        aggregated[id] = {
          id,
          title,
          count: 0,
          users: [],
          lastOccurred: event.timestamp,
        };
      }

      aggregated[id].count++;
      
      // Add user if logged in and not already in list
      if (event.user) {
        const existing = aggregated[id].users.find(
          u => u.email === event.user?.email
        );
        if (!existing) {
          aggregated[id].users.push({
            email: event.user.email,
            displayName: event.user.displayName,
          });
        }
      }

      // Update last occurred if newer
      if (event.timestamp > aggregated[id].lastOccurred) {
        aggregated[id].lastOccurred = event.timestamp;
      }
    }

    // Convert to array and sort by count
    const items = Object.values(aggregated)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20

    return NextResponse.json({
      eventType: type,
      totalCount: events.length,
      items,
      label: fieldInfo.label,
    });
  } catch (error) {
    console.error('[ADMIN EVENTS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event details' },
      { status: 500 }
    );
  }
}

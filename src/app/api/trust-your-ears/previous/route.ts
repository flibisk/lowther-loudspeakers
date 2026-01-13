import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * Get the start of the current week (Sunday at midnight UTC)
 */
function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = Sunday
  d.setUTCDate(d.getUTCDate() - day);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  try {
    const currentWeekStart = getWeekStart();

    // Get albums that were featured before this week started
    const previousAlbums = await prisma.album.findMany({
      where: {
        featuredAt: {
          not: null,
          lt: currentWeekStart, // Featured before this Sunday
        },
      },
      orderBy: {
        featuredAt: 'desc', // Most recently featured first
      },
      select: {
        id: true,
        musicBrainzReleaseGroupId: true,
        title: true,
        artist: true,
        year: true,
        coverUrl: true,
        votesCount: true,
        featuredAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      albums: previousAlbums.map(album => ({
        ...album,
        commentsCount: album._count.comments,
        _count: undefined,
      })),
    });
  } catch (error) {
    console.error('Previous albums fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch previous albums' },
      { status: 500 }
    );
  }
}

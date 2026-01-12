import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - TWO_WEEKS_MS);

    // Get albums that have been featured and their 2-week period has ended
    const previousAlbums = await prisma.album.findMany({
      where: {
        featuredAt: {
          not: null,
          lt: twoWeeksAgo, // Featured more than 2 weeks ago
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

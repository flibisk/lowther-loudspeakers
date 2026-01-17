import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get albums that haven't been featured yet (the voting queue)
    // Order by most votes first, then by earliest submission (tie-breaker)
    const albums = await prisma.album.findMany({
      where: {
        featuredAt: null, // Only albums that haven't been featured yet
      },
      orderBy: [
        { votesCount: 'desc' },  // Most votes first
        { createdAt: 'asc' },    // Tie-breaker: earliest submission first
      ],
      select: {
        id: true,
        musicBrainzReleaseGroupId: true,
        title: true,
        artist: true,
        year: true,
        coverUrl: true,
        votesCount: true,
        createdAt: true,
      },
    });

    // Log for debugging
    if (albums.length > 0) {
      console.log('[ALBUMS] Queue order:', albums.slice(0, 5).map(a => `${a.title} (${a.votesCount} votes)`).join(', '));
    }

    return NextResponse.json(
      { albums },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Albums fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

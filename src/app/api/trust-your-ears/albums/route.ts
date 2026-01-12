import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - TWO_WEEKS_MS);

    // Get albums that:
    // 1. Have never been featured (featuredAt is null), OR
    // 2. Are currently featured (featuredAt within last 2 weeks) - exclude these
    // This returns the "voting queue" for the next discussion
    const albums = await prisma.album.findMany({
      where: {
        featuredAt: null, // Only albums that haven't been featured yet
      },
      orderBy: [
        { votesCount: 'desc' },
        { createdAt: 'asc' }, // Tie-breaker: earliest submission first
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

    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Albums fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

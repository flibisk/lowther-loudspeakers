import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    // Get album with highest vote count
    // If there's a tie, get the one that reached that count first (earliest createdAt)
    const featuredAlbum = await prisma.album.findFirst({
      orderBy: [
        { votesCount: 'desc' },
        { createdAt: 'asc' }, // Tie-breaker: earliest album wins
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

    if (!featuredAlbum) {
      return NextResponse.json({ album: null });
    }

    return NextResponse.json({ album: featuredAlbum });
  } catch (error) {
    console.error('Featured album fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured album' },
      { status: 500 }
    );
  }
}

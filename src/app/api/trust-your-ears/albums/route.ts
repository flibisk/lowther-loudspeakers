import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const albums = await prisma.album.findMany({
      orderBy: {
        votesCount: 'desc',
      },
      select: {
        id: true,
        spotifyAlbumId: true,
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

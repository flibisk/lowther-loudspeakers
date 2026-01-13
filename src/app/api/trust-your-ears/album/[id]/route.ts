import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const album = await prisma.album.findUnique({
      where: { id },
      select: {
        id: true,
        musicBrainzReleaseGroupId: true,
        title: true,
        artist: true,
        year: true,
        coverUrl: true,
        votesCount: true,
        featuredAt: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      album: {
        ...album,
        commentsCount: album._count.comments,
        _count: undefined,
      },
    });
  } catch (error) {
    console.error('Album fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch album' },
      { status: 500 }
    );
  }
}

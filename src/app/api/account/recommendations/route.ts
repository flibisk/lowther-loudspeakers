import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

// Helper to get authenticated user ID
async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tye_session');

  if (!sessionCookie?.value) {
    return null;
  }

  const [userId] = sessionCookie.value.split(':');
  return userId || null;
}

// GET /api/account/recommendations - Get albums the user has recommended
export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Find all albums where the user has posted the first comment (recommender)
    // The first comment on an album is the recommendation comment
    const comments = await prisma.comment.findMany({
      where: {
        userId,
        parentId: null, // Only top-level comments
      },
      orderBy: { createdAt: 'desc' },
      include: {
        album: {
          select: {
            id: true,
            title: true,
            artist: true,
            coverUrl: true,
          },
        },
      },
    });

    // Get unique albums (user might have multiple comments on same album)
    const albumMap = new Map();
    for (const comment of comments) {
      if (!albumMap.has(comment.album.id)) {
        albumMap.set(comment.album.id, comment.album);
      }
    }

    const albums = Array.from(albumMap.values());

    return NextResponse.json({ albums });
  } catch (error) {
    console.error('[RECOMMENDATIONS GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

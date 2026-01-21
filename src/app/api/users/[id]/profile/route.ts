import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/users/[id]/profile - Get public user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 4; // Show 4 recommendations at a time

    // Fetch user with their equipment
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        displayName: true,
        fullName: true,
        level: true,
        createdAt: true,
      },
    });

    if (!user || !user.displayName) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch equipment
    const equipment = await prisma.equipment.findMany({
      where: { userId: id },
      orderBy: { addedAt: 'desc' },
      select: {
        id: true,
        name: true,
        fromOrder: true,
      },
    });

    // Fetch album recommendations (albums this user was first to recommend)
    // We look for albums where this user cast the first vote
    const firstVotes = await prisma.vote.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'asc' },
      select: {
        albumId: true,
        createdAt: true,
      },
    });

    // Get unique album IDs where this user was first voter
    const recommendedAlbumIds: string[] = [];
    for (const vote of firstVotes) {
      // Check if this was the first vote for this album
      const firstVoteForAlbum = await prisma.vote.findFirst({
        where: { albumId: vote.albumId },
        orderBy: { createdAt: 'asc' },
      });
      
      if (firstVoteForAlbum?.userId === id && !recommendedAlbumIds.includes(vote.albumId)) {
        recommendedAlbumIds.push(vote.albumId);
      }
    }

    // Get total count for pagination
    const totalRecommendations = recommendedAlbumIds.length;

    // Get paginated album IDs
    const paginatedAlbumIds = recommendedAlbumIds.slice((page - 1) * limit, page * limit);

    // Fetch album details
    const recommendations = await prisma.album.findMany({
      where: {
        id: { in: paginatedAlbumIds },
      },
      select: {
        id: true,
        title: true,
        artist: true,
        coverUrl: true,
        releaseDate: true,
        createdAt: true,
      },
    });

    // Sort to match the order of recommendedAlbumIds
    const sortedRecommendations = paginatedAlbumIds
      .map(id => recommendations.find(r => r.id === id))
      .filter(Boolean);

    return NextResponse.json({
      user: {
        id: user.id,
        displayName: user.displayName,
        fullName: user.fullName,
        level: user.level || 'ENTHUSIAST',
        memberSince: user.createdAt,
      },
      equipment,
      recommendations: sortedRecommendations,
      pagination: {
        page,
        limit,
        total: totalRecommendations,
        hasMore: page * limit < totalRecommendations,
      },
    });
  } catch (error) {
    console.error('[USER PROFILE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { headers } from 'next/headers';
import { createHash } from 'crypto';

// Simple upvote for existing albums - doesn't require authentication
// Uses IP-based rate limiting to prevent abuse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { albumId } = body;

    if (!albumId || typeof albumId !== 'string') {
      return NextResponse.json(
        { error: 'albumId is required' },
        { status: 400 }
      );
    }

    // Get voter identifier from IP + user agent
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const userAgent = headersList.get('user-agent') || '';
    
    // Create a hash of IP + user agent for anonymous but consistent identification
    const voterHash = createHash('sha256')
      .update(`${ip}:${userAgent}`)
      .digest('hex')
      .substring(0, 16);

    // Check if album exists and is not currently featured
    const album = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    // Don't allow voting on the currently featured album
    if (album.featuredAt) {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Go to Sunday
      weekStart.setHours(0, 0, 0, 0);
      
      if (new Date(album.featuredAt) >= weekStart) {
        return NextResponse.json(
          { error: 'Cannot vote on the currently featured album' },
          { status: 400 }
        );
      }
    }

    // Check if this voter already voted for this album
    const existingVote = await prisma.vote.findUnique({
      where: {
        albumId_voterHash: {
          albumId: album.id,
          voterHash: `anon:${voterHash}`,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this album', alreadyVoted: true },
        { status: 409 }
      );
    }

    // Create vote and increment count
    await prisma.$transaction([
      prisma.vote.create({
        data: {
          albumId: album.id,
          voterHash: `anon:${voterHash}`,
        },
      }),
      prisma.album.update({
        where: { id: album.id },
        data: {
          votesCount: {
            increment: 1,
          },
        },
      }),
    ]);

    // Fetch updated album
    const updatedAlbum = await prisma.album.findUnique({
      where: { id: album.id },
    });

    console.log(`[UPVOTE] Anonymous vote for "${album.title}"`);

    return NextResponse.json({
      success: true,
      album: updatedAlbum,
      newVoteCount: updatedAlbum?.votesCount || album.votesCount + 1,
    });
  } catch (error) {
    console.error('Upvote error:', error);
    
    // Handle unique constraint violation (race condition)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'You have already voted for this album', alreadyVoted: true },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}

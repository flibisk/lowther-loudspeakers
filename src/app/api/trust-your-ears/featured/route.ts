import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

export async function GET() {
  try {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - TWO_WEEKS_MS);

    // 1. Check if there's a currently featured album (featuredAt within last 2 weeks)
    let featuredAlbum = await prisma.album.findFirst({
      where: {
        featuredAt: {
          gte: twoWeeksAgo,
        },
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
        createdAt: true,
      },
    });

    // 2. If no current featured album, find the next one to feature
    if (!featuredAlbum) {
      // Get the highest voted album that hasn't been featured yet
      const nextToFeature = await prisma.album.findFirst({
        where: {
          featuredAt: null, // Never been featured
        },
        orderBy: [
          { votesCount: 'desc' },
          { createdAt: 'asc' }, // Tie-breaker: earliest submission wins
        ],
      });

      if (nextToFeature) {
        // Mark this album as featured now
        featuredAlbum = await prisma.album.update({
          where: { id: nextToFeature.id },
          data: { featuredAt: now },
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
          },
        });
        
        console.log(`[FEATURED] New album featured: "${featuredAlbum.title}" by ${featuredAlbum.artist}`);
      }
    }

    if (!featuredAlbum) {
      return NextResponse.json({ album: null });
    }

    // Calculate days remaining
    const featuredAtDate = new Date(featuredAlbum.featuredAt!);
    const endsAt = new Date(featuredAtDate.getTime() + TWO_WEEKS_MS);
    const daysRemaining = Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

    return NextResponse.json({ 
      album: featuredAlbum,
      daysRemaining,
      endsAt: endsAt.toISOString(),
    });
  } catch (error) {
    console.error('Featured album fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured album' },
      { status: 500 }
    );
  }
}

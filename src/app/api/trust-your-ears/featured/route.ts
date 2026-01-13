import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * Get the start of the current week (Sunday at midnight UTC)
 */
function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = Sunday
  d.setUTCDate(d.getUTCDate() - day);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the current week (Saturday at 23:59:59 UTC)
 */
function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * Calculate days remaining until Sunday
 */
function getDaysUntilSunday(): number {
  const now = new Date();
  const weekEnd = getWeekEnd(now);
  const diffMs = weekEnd.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
}

export async function GET() {
  try {
    const now = new Date();
    const currentWeekStart = getWeekStart(now);

    // 1. Check if there's an album featured this week (featuredAt >= this Sunday)
    let featuredAlbum = await prisma.album.findFirst({
      where: {
        featuredAt: {
          gte: currentWeekStart,
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

    // 2. If no album featured this week, select the next one
    if (!featuredAlbum) {
      // Get the highest voted album that hasn't been featured yet
      const nextToFeature = await prisma.album.findFirst({
        where: {
          featuredAt: null, // Never been featured
        },
        orderBy: [
          { votesCount: 'desc' },
          { createdAt: 'asc' }, // Tie-breaker: earliest submission first
        ],
      });

      if (nextToFeature) {
        // Mark this album as featured now (start of this week's discussion)
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
        
        console.log(`[FEATURED] New weekly album: "${featuredAlbum.title}" by ${featuredAlbum.artist}`);
      }
    }

    if (!featuredAlbum) {
      return NextResponse.json({ album: null });
    }

    // Calculate days remaining until next Sunday
    const daysRemaining = getDaysUntilSunday();
    const weekEnd = getWeekEnd(now);

    return NextResponse.json({ 
      album: featuredAlbum,
      daysRemaining,
      endsAt: weekEnd.toISOString(),
      resetsOn: 'Sunday',
    });
  } catch (error) {
    console.error('Featured album fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured album' },
      { status: 500 }
    );
  }
}

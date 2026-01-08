/**
 * Seed script for Trust Your Ears feature
 * Adds example albums and votes to the database
 */

import { PrismaClient } from '../src/generated/prisma';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Example albums to seed (using real Spotify album IDs for demonstration)
// These are popular albums that work well for testing
const exampleAlbums = [
  {
    spotifyAlbumId: '4uLU6hMCjMI75M1A2tKUQC', // Kind of Blue - Miles Davis
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    year: 1959,
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f',
  },
  {
    spotifyAlbumId: '1ATL5GLyefJaxhQzSPVrLX', // A Love Supreme - John Coltrane
    title: 'A Love Supreme',
    artist: 'John Coltrane',
    year: 1965,
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f',
  },
  {
    spotifyAlbumId: '3nzuGtN3nXARvvecier4K0', // Time Out - Dave Brubeck
    title: 'Time Out',
    artist: 'The Dave Brubeck Quartet',
    year: 1959,
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f',
  },
  {
    spotifyAlbumId: '0ETFjACduPey3jDugGawQ1', // Blue Train - John Coltrane
    title: 'Blue Train',
    artist: 'John Coltrane',
    year: 1958,
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f',
  },
  {
    spotifyAlbumId: '4m2880jivSbbyEGAKfITCa', // The Köln Concert - Keith Jarrett
    title: 'The Köln Concert',
    artist: 'Keith Jarrett',
    year: 1975,
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f',
  },
];

async function main() {
  console.log('🌱 Seeding Trust Your Ears database...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...');
  await prisma.vote.deleteMany();
  await prisma.album.deleteMany();
  console.log('✓ Existing data cleared\n');

  // Create albums
  console.log('Creating albums...');
  const createdAlbums = [];
  
  for (const albumData of exampleAlbums) {
    const album = await prisma.album.create({
      data: albumData,
    });
    createdAlbums.push(album);
    console.log(`  ✓ Created: ${album.title} by ${album.artist}`);
  }
  console.log(`\n✓ Created ${createdAlbums.length} albums\n`);

  // Create votes (distribute votes across albums)
  console.log('Creating votes...');
  const voteCounts = [5, 3, 2, 1, 1]; // Different vote counts for each album
  
  for (let i = 0; i < createdAlbums.length; i++) {
    const album = createdAlbums[i];
    const voteCount = voteCounts[i] || 1;
    
    for (let j = 0; j < voteCount; j++) {
      // Generate unique voter hash for each vote
      const voterHash = createHash('sha256')
        .update(`seed-voter-${album.id}-${j}-${Date.now()}-${Math.random()}`)
        .digest('hex');

      await prisma.vote.create({
        data: {
          albumId: album.id,
          voterHash,
        },
      });
    }
    
    // Update vote count
    await prisma.album.update({
      where: { id: album.id },
      data: { votesCount: voteCount },
    });
    
    console.log(`  ✓ Added ${voteCount} votes to ${album.title}`);
  }
  
  console.log('\n✓ Seeding complete!\n');
  
  // Display summary
  const totalAlbums = await prisma.album.count();
  const totalVotes = await prisma.vote.count();
  const featuredAlbum = await prisma.album.findFirst({
    orderBy: [{ votesCount: 'desc' }, { createdAt: 'asc' }],
  });
  
  console.log('📊 Summary:');
  console.log(`  Total albums: ${totalAlbums}`);
  console.log(`  Total votes: ${totalVotes}`);
  if (featuredAlbum) {
    console.log(`  Featured album: ${featuredAlbum.title} by ${featuredAlbum.artist} (${featuredAlbum.votesCount} votes)`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

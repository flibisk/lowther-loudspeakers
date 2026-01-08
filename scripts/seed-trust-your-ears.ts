/**
 * Seed script for Trust Your Ears feature
 * Adds example albums and votes to the database
 */

import { PrismaClient } from '../node_modules/.prisma/client/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Example albums to seed (using real MusicBrainz release-group IDs)
// These are popular albums that work well for testing
// MusicBrainz release-group IDs can be found at https://musicbrainz.org
const exampleAlbums = [
  {
    musicBrainzReleaseGroupId: 'e8c24e3e-7b83-3d6a-9c83-3d6a9c83e8c2', // Kind of Blue - Miles Davis (example ID)
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    year: 1959,
    coverUrl: null, // Will be fetched from Cover Art Archive or use placeholder
  },
  {
    musicBrainzReleaseGroupId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', // A Love Supreme - John Coltrane (example ID)
    title: 'A Love Supreme',
    artist: 'John Coltrane',
    year: 1965,
    coverUrl: null,
  },
  {
    musicBrainzReleaseGroupId: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', // Time Out - Dave Brubeck (example ID)
    title: 'Time Out',
    artist: 'The Dave Brubeck Quartet',
    year: 1959,
    coverUrl: null,
  },
];

// Note: Replace the example IDs above with real MusicBrainz release-group IDs
// You can find them by searching at https://musicbrainz.org

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

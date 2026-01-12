import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlbumList } from '@/components/trust-your-ears/album-list';
import { FeaturedAlbum } from '@/components/trust-your-ears/featured-album';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trust Your Ears | Lowther Loudspeakers',
  description: 'Community-driven album listening recommendations. Discover what the Lowther community is listening to.',
};

export default async function TrustYourEarsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Featured Album Banner - Full Width with Comments */}
      <FeaturedAlbum showComments={true} />

      {/* Content Section */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header with CTA */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="font-hvmuse text-2xl text-neutral-900">
              Community Recommendations
            </h2>
            <p className="mt-1 font-sarabun text-sm text-neutral-500">
              Vote for albums you think everyone should hear
            </p>
          </div>
          <Link href="/trust-your-ears/add">
            <Button variant="white" size="lowther" className="gap-2 shadow-sm">
              <Plus className="size-4" />
              Recommend
            </Button>
          </Link>
        </div>

        {/* Album List */}
        <AlbumList />
        
        {/* Footer text */}
        <div className="mt-12 text-center">
          <p className="font-sarabun text-sm text-neutral-400">
            The album with the most votes becomes the Current Listen
          </p>
        </div>
      </div>
    </div>
  );
}

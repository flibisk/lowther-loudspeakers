import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlbumList } from '@/components/trust-your-ears/album-list';
import { FeaturedAlbum } from '@/components/trust-your-ears/featured-album';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trust Your Ears | Lowther Loudspeakers',
  description: 'Community-driven album listening recommendations. Discover what the Lowther community is listening to.',
};

export default async function TrustYourEarsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-hvmuse text-4xl font-normal tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Trust Your Ears
          </h1>
          <p className="mt-4 font-sarabun text-lg text-neutral-600">
            Community-driven album recommendations
          </p>
        </div>

        {/* Featured Album Section */}
        <div className="mb-16">
          <FeaturedAlbum />
        </div>

        {/* CTA */}
        <div className="mb-12 flex justify-center">
          <Link href="/trust-your-ears/add">
            <Button variant="white" size="lowther" className="gap-2">
              <Plus className="size-4" />
              Recommend an Album
            </Button>
          </Link>
        </div>

        {/* Community Album List */}
        <div className="mb-8">
          <h2 className="font-hvmuse mb-6 text-2xl font-normal text-neutral-900">
            Community Recommendations
          </h2>
          <AlbumList />
        </div>
      </div>
    </div>
  );
}

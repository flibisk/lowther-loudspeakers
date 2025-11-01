import { MetadataRoute } from 'next';
import speakersData from '@/lib/data/speakers.json';
import postsData from '@/lib/data/posts.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lowtherloudspeakers.com';

  // Static pages
  const staticPages = [
    '',
    '/category/loudspeakers',
    '/category/drive-units',
    '/category/cables',
    '/build-a-lowther',
    '/blog',
    '/reviews',
    '/listen',
    '/history',
    '/brand/handcrafted',
    '/brand/lasting-legacy',
    '/catalogue',
    '/ambassador',
    '/landings/qw-a',
    '/landings/qw-b',
  ];

  // Dynamic speaker pages
  const speakerPages = speakersData.map((speaker) => ({
    url: `${baseUrl}/speakers/${speaker.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Dynamic blog pages
  const blogPages = postsData.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic verification pages (for known serials)
  const verificationPages = [
    'LL2024001',
    'LL2024002',
    'LL2024003',
    'LL2024004',
  ].map((serial) => ({
    url: `${baseUrl}/verify/${serial}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }));

  // Combine all pages
  const allPages = [
    // Static pages
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1.0 : 0.8,
    })),
    // Dynamic pages
    ...speakerPages,
    ...blogPages,
    ...verificationPages,
  ];

  return allPages;
}

import { Metadata } from "next";
import Image from "next/image";
import { generateSEOMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BlogGrid } from "@/components/blog-grid";

export const metadata: Metadata = generateSEOMetadata({
  title: "Blog",
  description: "Insights, guides, and stories from the world of Lowther loudspeakers. Building tips, acoustic design, and the Lowther story.",
  keywords: ["blog", "articles", "guides", "acoustics", "building", "DIY"],
  url: "/blog",
});

// Enable ISR - Revalidate every hour (3600 seconds)
export const revalidate = 3600;

/**
 * Beehiiv API Response Types
 */
interface BeehiivPost {
  id: string;
  title: string;
  preview_text: string;
  thumbnail_url: string | null;
  published_at: string | number;
  web_url: string;
}

interface BeehiivResponse {
  data: BeehiivPost[];
  total_results: number;
}

/**
 * Fetch posts from Beehiiv API
 */
async function fetchBeehiivPosts(): Promise<BeehiivPost[]> {
  const beehiivApiKey = process.env.BEEHIIV_API_KEY;
  const beehiivPublicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!beehiivApiKey || !beehiivPublicationId) {
    console.error('Beehiiv API credentials not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${beehiivPublicationId}/posts?status=confirmed&limit=50&order_by=publish_date&direction=desc`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${beehiivApiKey}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error('Beehiiv API error:', response.status, await response.text());
      return [];
    }

    const data: BeehiivResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Beehiiv posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await fetchBeehiivPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/blog/hero/Lowther-Blog-hero.jpg"
          alt="Lowther Blog - Latest News and Updates"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-3xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">THE LOWTHER JOURNAL</span>
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Latest news and Updates
          </h1>
          
          <p className="text-lg text-white/90 leading-relaxed">
            Stay up to date with all Lowther news, product updates and be the first to know when we drop a special edition.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog' }
        ]} 
      />

      {/* Blog Posts Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </div>
  );
}

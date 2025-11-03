import Image from "next/image";
import Link from "next/link";

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
 * Fetch latest posts from Beehiiv API
 */
async function fetchLatestPosts(): Promise<BeehiivPost[]> {
  const beehiivApiKey = process.env.BEEHIIV_API_KEY;
  const beehiivPublicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!beehiivApiKey || !beehiivPublicationId) {
    console.error('Beehiiv API credentials not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${beehiivPublicationId}/posts?status=confirmed&limit=3&order_by=publish_date&direction=desc`,
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

/**
 * Format date for display
 */
function formatDate(dateString: string | number): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export async function BlogSection() {
  const posts = await fetchLatestPosts();

  // If no posts, don't render the section
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl lg:text-5xl mb-6" style={{ color: '#c59862' }}>
            From Our Blog
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Stay up to date with our news, events, product announcements.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <article key={post.id} className="bg-white group">
              <a 
                href={post.web_url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {/* Image */}
                {post.thumbnail_url && (
                  <div className="relative aspect-[4/3] overflow-hidden mb-6">
                    <Image
                      src={post.thumbnail_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3">
                  {/* Date */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-900 uppercase tracking-wider">
                      LATEST
                    </span>
                    <span className="text-gray-500">
                      {formatDate(post.published_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg leading-tight text-gray-900 group-hover:text-[#c59862] transition-colors">
                    {post.title}
                  </h3>

                  {/* Preview text */}
                  {post.preview_text && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {post.preview_text}
                    </p>
                  )}
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link 
            href="/blog" 
            className="text-gray-600 hover:text-[#c59862] transition-colors font-medium tracking-wider uppercase text-sm underline-animated"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function BlogSection() {
  // Sample blog posts - these will be replaced with Beehiiv integration
  const blogPosts = [
    {
      id: "building-acousta-davids-journey",
      title: "Building An Acousta: David's Journey",
      category: "THE LISTENING CIRCLE",
      date: "Sep 16, 2025",
      image: "/images/blog/building-acousta.jpg",
      href: "/blog/building-acousta-davids-journey"
    },
    {
      id: "the-px4-valve",
      title: "The PX4 Valve",
      category: "NEWS",
      date: "Sep 12, 2025",
      image: "/images/blog/px4-valve.jpg",
      href: "/blog/the-px4-valve"
    },
    {
      id: "passing-the-torch",
      title: "Passing The Torch: Why True Sound Must Find New Ears",
      category: "STORY",
      date: "Aug 9, 2025",
      image: "/images/blog/passing-torch.jpg",
      href: "/blog/passing-the-torch"
    }
  ];

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
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white group">
              <Link href={post.href}>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden mb-6">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {/* Category and Date */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-900 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-gray-500">
                      {post.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg leading-tight text-gray-900 group-hover:text-[#c59862] transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
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

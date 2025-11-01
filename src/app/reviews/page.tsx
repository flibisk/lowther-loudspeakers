import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Reviews",
  description: "Read reviews and testimonials from Lowther loudspeaker owners around the world. Discover what makes our loudspeakers special.",
  keywords: ["reviews", "testimonials", "customer feedback", "ratings"],
  url: "/reviews",
});

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: "James Richardson",
      location: "London, UK",
      model: "Philharmonic III",
      rating: 5,
      quote: "The Philharmonic III delivers the most natural sound I've ever heard. Every note is perfectly rendered with incredible detail and depth. The craftsmanship is exceptional.",
      date: "2024-09-15"
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      location: "Edinburgh, UK",
      model: "Quarter Wave Kit",
      rating: 5,
      quote: "Building the Quarter Wave kit was incredibly rewarding. The instructions were clear and the result exceeded my expectations. The sound quality is outstanding.",
      date: "2024-09-10"
    },
    {
      id: 3,
      name: "David Chen",
      location: "Manchester, UK",
      model: "Grand Opera",
      rating: 5,
      quote: "These loudspeakers are built to last. The craftsmanship is exceptional and the sound quality is outstanding. They've transformed my listening experience.",
      date: "2024-09-05"
    },
    {
      id: 4,
      name: "Emma Thompson",
      location: "Birmingham, UK",
      model: "Cottage",
      rating: 5,
      quote: "Perfect for my smaller listening room. The Cottage delivers the signature Lowther sound in a compact form. Beautifully crafted and sounds amazing.",
      date: "2024-08-28"
    },
    {
      id: 5,
      name: "Michael Brown",
      location: "Glasgow, UK",
      model: "Philharmonic III",
      rating: 5,
      quote: "The attention to detail is remarkable. From the hand-selected drivers to the beautiful walnut finish, everything about these loudspeakers is exceptional.",
      date: "2024-08-20"
    },
    {
      id: 6,
      name: "Lisa Anderson",
      location: "Leeds, UK",
      model: "Quarter Wave Kit",
      rating: 5,
      quote: "As a DIY enthusiast, I was impressed by the quality of the kit and the support provided. The end result is a loudspeaker that rivals commercial offerings.",
      date: "2024-08-15"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Customer Reviews
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Read what our customers have to say about their Lowther loudspeakers. 
            Discover why audiophiles around the world choose Lowther for their listening pleasure.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">4.9</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-muted-foreground">Would Recommend</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <Badge variant="outline">{review.model}</Badge>
                </div>
                
                <blockquote className="text-lg italic mb-4">
                  "{review.quote}"
                </blockquote>
                
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium">{review.name}</div>
                  <div>{review.location}</div>
                  <div>{new Date(review.date).toLocaleDateString('en-GB')}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Review */}
        <div className="mt-16">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-300 text-2xl">★</span>
                  ))}
                </div>
                <blockquote className="text-xl italic mb-6">
                  "After 40 years in audio, I've never heard anything quite like the Philharmonic III. 
                  These loudspeakers represent the pinnacle of acoustic engineering and craftsmanship."
                </blockquote>
                <div className="font-medium">- Robert Wilson, Audio Engineer</div>
                <div className="text-sm opacity-75">London, UK</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="font-display text-2xl font-bold mb-4">
            Ready to Experience Lowther?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join our community of satisfied customers and discover what makes Lowther special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Browse Loudspeakers
            </button>
            <button className="border border-border px-6 py-3 rounded-md font-medium hover:bg-neutral-50 transition-colors">
              Arrange a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

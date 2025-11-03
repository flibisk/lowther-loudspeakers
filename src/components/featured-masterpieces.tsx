'use client';

import Link from "next/link";
import { SpeakerCard } from "@/components/speaker-card";

export function FeaturedMasterpieces() {
  const allSpeakers = [
    {
      id: "quarterwave",
      title: "Quarter Wave",
      feeling: "Discreet. Architectural.",
      image: "/images/card-images/card-image-acoustaQW.avif",
      href: "/loudspeakers/acousta-quarter-wave"
    },
    {
      id: "edilia",
      title: "Edilia", 
      feeling: "Elegant. Focused.",
      image: "/images/card-images/card-image-Edillia.webp",
      href: "/loudspeakers/edilia"
    },
    {
      id: "hegeman",
      title: "Hegeman",
      feeling: "Exclusive. Reverent.",
      image: "/images/card-images/card-image-hegeman.webp", 
      href: "/loudspeakers/hegeman"
    },
    {
      id: "acousta-117",
      title: "Acousta 117",
      feeling: "Timeless. Versatile.",
      image: "/images/card-images/card-image-Acousta-117.webp",
      href: "/speakers/acousta-117"
    },
    {
      id: "almira",
      title: "Almira",
      feeling: "Balanced. Expressive.",
      image: "/images/card-images/card-image-Almira.webp",
      href: "/speakers/almira"
    },
    {
      id: "tp2",
      title: "TP2",
      feeling: "Powerful. Grand.",
      image: "/images/card-images/card-image-TP2.webp",
      href: "/speakers/tp2"
    },
    {
      id: "audiovector",
      title: "Audiovector",
      feeling: "Monumental. Adaptable.",
      image: "/images/card-images/card-image-audiovector.webp",
      href: "/speakers/audiovector"
    },
    {
      id: "voigt-horn",
      title: "4ft Voigt Horn",
      feeling: "Historic. Sculptural.",
      image: "/images/card-images/card-image-voigt-horn.avif",
      href: "/speakers/voigt-horn"
    }
  ];

  // Select specific featured speakers to avoid hydration mismatch
  const featuredSpeakers = [
    allSpeakers.find(s => s.id === "quarterwave"),
    allSpeakers.find(s => s.id === "edilia"), 
    allSpeakers.find(s => s.id === "hegeman")
  ].filter((speaker): speaker is typeof allSpeakers[0] => speaker !== undefined);

  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl lg:text-5xl mb-6" style={{ color: '#c59862' }}>
            Our Masterpieces
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Handcrafted, folded-horn speakers housing our legendary full-range sonic instruments.
          </p>
        </div>

        {/* Featured Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredSpeakers.map((speaker) => (
            <SpeakerCard
              key={speaker.id}
              id={speaker.id}
              title={speaker.title}
              feeling={speaker.feeling}
              image={speaker.image}
              href={speaker.href}
            />
          ))}
        </div>

        {/* Explore All Link */}
        <div className="text-center">
          <Link 
            href="/category/loudspeakers" 
            className="text-black hover:text-[#c59862] transition-colors font-medium tracking-wider uppercase text-sm underline-animated"
          >
            Explore ALL our masterpieces
          </Link>
        </div>
      </div>
    </section>
  );
}

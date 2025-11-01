import { Metadata } from "next";
import { Grid } from "@/components/grid";
import { generateSEOMetadata } from "@/lib/seo";
import speakersData from "@/lib/data/speakers.json";

export const metadata: Metadata = generateSEOMetadata({
  title: "Loudspeakers",
  description: "Discover our complete range of handcrafted loudspeakers. From compact cottage models to flagship Philharmonic series, each designed for uncompromising sound quality.",
  keywords: ["loudspeakers", "speakers", "philharmonic", "grand opera", "cottage"],
  url: "/category/loudspeakers",
});

export default function LoudspeakersPage() {
  const loudspeakers = speakersData.filter(speaker => speaker.category === "loudspeakers");

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Loudspeakers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our complete range of handcrafted loudspeakers, each designed to deliver 
            the signature Lowther sound. From intimate cottage models to commanding 
            Philharmonic series, find the perfect loudspeaker for your space.
          </p>
        </div>
        
        <Grid
          products={loudspeakers}
          columns={3}
        />
      </div>
    </div>
  );
}

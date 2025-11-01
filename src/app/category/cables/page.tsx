import { Metadata } from "next";
import { Grid } from "@/components/grid";
import { generateSEOMetadata } from "@/lib/seo";

// Mock cables data
const cables = [
  {
    id: "reference-cables",
    slug: "reference-cables",
    title: "Reference Cables",
    subtitle: "Ultimate Performance",
    description: "Our flagship cable range, designed to preserve every nuance of your audio signal.",
    price: 895,
    currency: "GBP",
    images: ["/images/cables/reference.jpg"],
    featured: true,
    inStock: true,
  },
  {
    id: "studio-cables",
    slug: "studio-cables",
    title: "Studio Cables",
    subtitle: "Professional Grade",
    description: "High-quality cables designed for professional applications and critical listening.",
    price: 495,
    currency: "GBP",
    images: ["/images/cables/studio.jpg"],
    featured: true,
    inStock: true,
  },
  {
    id: "essential-cables",
    slug: "essential-cables",
    title: "Essential Cables",
    subtitle: "Quality Foundation",
    description: "Well-built cables that provide excellent performance without compromise.",
    price: 295,
    currency: "GBP",
    images: ["/images/cables/essential.jpg"],
    featured: false,
    inStock: true,
  },
];

export const metadata: Metadata = generateSEOMetadata({
  title: "Cables",
  description: "High-quality cables designed to preserve the integrity of your Lowther system. From essential to reference grade.",
  keywords: ["cables", "speaker cables", "interconnects", "reference", "studio"],
  url: "/category/cables",
});

export default function CablesPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Cables
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            High-quality cables designed to preserve the integrity of your Lowther system. 
            From essential to reference grade, our cables are built to last and perform.
          </p>
        </div>
        
        <Grid
          products={cables}
          columns={3}
        />
      </div>
    </div>
  );
}

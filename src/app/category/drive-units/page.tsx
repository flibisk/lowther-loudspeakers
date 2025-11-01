import { Metadata } from "next";
import { Grid } from "@/components/grid";
import { generateSEOMetadata } from "@/lib/seo";

// Mock drive units data
const driveUnits = [
  {
    id: "dx3-driver",
    slug: "dx3-driver",
    title: "DX3 Driver",
    subtitle: "Reference Grade",
    description: "Our flagship drive unit, hand-selected for the Philharmonic series. Exceptional clarity and dynamics.",
    price: 2995,
    currency: "GBP",
    images: ["/images/drive-units/dx3.jpg"],
    featured: true,
    inStock: true,
  },
  {
    id: "pm6c-driver",
    slug: "pm6c-driver",
    title: "PM6C Driver",
    subtitle: "Theatrical Power",
    description: "Designed for larger spaces, delivering orchestral dynamics with remarkable clarity.",
    price: 2495,
    currency: "GBP",
    images: ["/images/drive-units/pm6c.jpg"],
    featured: true,
    inStock: true,
  },
  {
    id: "pm2a-driver",
    slug: "pm2a-driver",
    title: "PM2A Driver",
    subtitle: "Intimate Precision",
    description: "Perfect for smaller spaces, delivering the signature Lowther sound in compact form.",
    price: 1995,
    currency: "GBP",
    images: ["/images/drive-units/pm2a.jpg"],
    featured: false,
    inStock: true,
  },
  {
    id: "pm4a-driver",
    slug: "pm4a-driver",
    title: "PM4A Driver",
    subtitle: "Classic Design",
    description: "A timeless design that has defined Lowther loudspeakers for decades.",
    price: 1595,
    currency: "GBP",
    images: ["/images/drive-units/pm4a.jpg"],
    featured: false,
    inStock: true,
  },
];

export const metadata: Metadata = generateSEOMetadata({
  title: "Drive Units",
  description: "The heart of every Lowther loudspeaker. Hand-selected and individually tested drive units for exceptional sound quality.",
  keywords: ["drive units", "drivers", "DX3", "PM6C", "PM2A", "PM4A"],
  url: "/category/drive-units",
});

export default function DriveUnitsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Drive Units
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The heart of every Lowther loudspeaker. Each drive unit is hand-selected 
            and individually tested to ensure exceptional sound quality. Choose from 
            our range of drivers designed for different applications and spaces.
          </p>
        </div>
        
        <Grid
          products={driveUnits}
          columns={3}
        />
      </div>
    </div>
  );
}

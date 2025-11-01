import { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Quarter Wave - Classic Design",
  description: "Experience the timeless Quarter Wave design that has defined Lowther loudspeakers for decades. Now available as a build-it-yourself kit.",
  keywords: ["quarter wave", "classic", "DIY", "kit", "build"],
  url: "/landings/qw-a",
});

export default function QuarterWaveVariantA() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Variant A: Classic Focus */}
      <Hero
        title="Quarter Wave"
        subtitle="Classic Design, Timeless Sound"
        description="Experience the design that has defined Lowther loudspeakers for decades. Built with traditional craftsmanship and acoustic principles."
        backgroundImage="/images/quarter-wave-hero.jpg"
        ctaPrimary={{
          text: "View Kit Details",
          href: "/speakers/quarter-wave"
        }}
        ctaSecondary={{
          text: "Learn More",
          href: "/build-a-lowther"
        }}
      />

      {/* Heritage Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                A Design That Endures
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                The Quarter Wave design has been refined over decades of acoustic research. 
                This transmission line approach delivers natural, uncoloured sound that 
                reveals every nuance of your music.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Proven Design</Badge>
                  <span className="text-sm">Decades of refinement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Natural Sound</Badge>
                  <span className="text-sm">Transmission line loading</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Handcrafted Quality</Badge>
                  <span className="text-sm">Traditional joinery</span>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="/images/quarter-wave-detail.jpg"
                alt="Quarter Wave construction details"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Technical Excellence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built to exacting standards with premium components and traditional construction methods.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <h3 className="font-display text-xl font-semibold">PM4A Driver</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hand-selected Lowther PM4A drive unit, individually tested for performance.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="font-display text-xl font-semibold">Quarter Wave Loading</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Transmission line design for natural bass extension and low distortion.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="font-display text-xl font-semibold">Premium Materials</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  High-grade MDF cabinet with traditional joinery and premium finishes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Build Experience */}
      <section className="py-16">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Build Your Own
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the satisfaction of building your own loudspeaker. Our comprehensive kit 
              includes everything you need with detailed instructions and expert support.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  1
                </div>
                <h3 className="font-display font-semibold mb-2">Complete Kit</h3>
                <p className="text-sm text-muted-foreground">
                  All components pre-cut and ready for assembly
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  2
                </div>
                <h3 className="font-display font-semibold mb-2">Step-by-Step Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed instructions with photos and tips
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  3
                </div>
                <h3 className="font-display font-semibold mb-2">Expert Support</h3>
                <p className="text-sm text-muted-foreground">
                  Help from our technical team when you need it
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/speakers/quarter-wave">View Kit Details</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/build-a-lowther">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

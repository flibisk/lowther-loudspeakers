import { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Quarter Wave - DIY Excellence",
  description: "Build your own Quarter Wave loudspeaker with our comprehensive DIY kit. Everything you need to create exceptional sound in your own workshop.",
  keywords: ["quarter wave", "DIY", "build", "workshop", "kit"],
  url: "/landings/qw-b",
});

export default function QuarterWaveVariantB() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Variant B: DIY Focus */}
      <Hero
        title="Quarter Wave"
        subtitle="Build Excellence Yourself"
        description="Create exceptional sound in your own workshop. Our comprehensive DIY kit gives you everything needed to build a professional-grade loudspeaker."
        backgroundImage="/images/quarter-wave-workshop.jpg"
        ctaPrimary={{
          text: "Start Building",
          href: "/speakers/quarter-wave"
        }}
        ctaSecondary={{
          text: "View Guide",
          href: "/blog/building-quarter-wave"
        }}
      />

      {/* DIY Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-lg overflow-hidden order-2 lg:order-1">
              <Image
                src="/images/workshop-build.jpg"
                alt="Building Quarter Wave in workshop"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Why Build Yourself?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Building your own loudspeaker isn't just about saving money. It's about 
                understanding how great sound is created and gaining skills that last a lifetime.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Cost Effective</Badge>
                  <span className="text-sm">Significant savings vs. pre-built</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Learn Skills</Badge>
                  <span className="text-sm">Woodworking and electronics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Customisation</Badge>
                  <span className="text-sm">Choose your own finish</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Pride of Ownership</Badge>
                  <span className="text-sm">Built with your own hands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kit Contents */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive kit includes all components, hardware, and detailed instructions. 
              Just add basic tools and your time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <h3 className="font-display text-lg font-semibold">Pre-cut Panels</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  High-grade MDF cabinet panels, precision cut and ready for assembly.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="font-display text-lg font-semibold">PM4A Driver</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hand-selected Lowther PM4A drive unit, individually tested.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="font-display text-lg font-semibold">Hardware Pack</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All screws, terminals, binding posts, and assembly hardware.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="font-display text-lg font-semibold">Instructions</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Step-by-step guide with photos, tips, and troubleshooting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Required */}
      <section className="py-16">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Tools You'll Need
              </h2>
              <p className="text-lg text-muted-foreground">
                Basic woodworking tools that most DIY enthusiasts already own.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <h3 className="font-display text-xl font-semibold">Essential Tools</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span>Drill and drill bits</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span>Screwdriver set</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span>Measuring tape</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span>Clamps (4-6 recommended)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="font-display text-xl font-semibold">Recommended Tools</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span>Router (for binding posts)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span>Orbital sander</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span>Square and level</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span>Finishing supplies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join hundreds of DIY enthusiasts who have built their own Lowther loudspeakers. 
            Start your project today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/speakers/quarter-wave">Order Kit Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/build-a-lowther">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
